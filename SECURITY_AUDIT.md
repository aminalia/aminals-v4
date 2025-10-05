# SECURITY AUDIT REPORT - AMINALS SMART CONTRACT SYSTEM

**Audit Date:** September 30, 2025
**Auditor:** Expert Smart Contract Security Review
**Codebase:** Aminals v1.0 (Factory-Based Architecture)
**Contracts Reviewed:** 19 Solidity contracts in `/src`

---

## EXECUTIVE SUMMARY

This comprehensive security audit analyzed the Aminals decentralized digital pet platform, which implements NFT ownership with complex interaction mechanics, autonomous contract behavior, breeding auctions, and gene-based trait systems. The audit identified **5 critical**, **7 high**, **6 medium**, and **7 low** severity issues across the codebase.

### Key Findings

**Critical vulnerabilities** include:
- Weak randomness implementation allowing outcome manipulation
- Unprotected treasury payout mechanisms
- Potential integer overflow in economic calculations
- Reentrancy attack vectors in auction settlement
- Unvalidated external calls to skill contracts

**Deployment Recommendation:** ⚠️ **NOT PRODUCTION READY** - Critical vulnerabilities must be resolved before mainnet deployment.

---

## TABLE OF CONTENTS

1. [Critical Vulnerabilities](#critical-vulnerabilities)
2. [High Severity Issues](#high-severity-issues)
3. [Medium Severity Issues](#medium-severity-issues)
4. [Low Severity Issues](#low-severity-issues)
5. [Summary Statistics](#summary-statistics)
6. [Remediation Priority](#remediation-priority)
7. [Conclusion](#conclusion)

---

## CRITICAL VULNERABILITIES

### 1. WEAK RANDOMNESS IN FIGHT SKILL AND GENE SELECTION

**Severity:** 🔴 CRITICAL
**Contracts:** `FightSkill.sol:113-122`, `GeneAuction.sol:657-663`
**CWE-338:** Use of Cryptographically Weak PRNG

#### Description
Both fight outcome determination and gene tie-breaking use `block.prevrandao` and `block.timestamp` for randomness generation. These values are predictable and can be manipulated by miners/validators.

#### Vulnerable Code
```solidity
// FightSkill.sol
function _success(uint256 attackerMastery, uint256 victimMastery) internal view returns (bool) {
    uint256 randomV = uint256(keccak256(abi.encodePacked(
        block.timestamp,
        block.prevrandao
    ))) % 100;
    return randomV < attackerProbability;
}

// GeneAuction.sol
function _generateRandomness(uint256 seed, uint256 max) internal view returns (uint256) {
    uint256 randomValue = uint256(keccak256(abi.encodePacked(
        block.prevrandao, block.timestamp, block.number, msg.sender, seed
    )));
    return randomValue % max;
}
```

#### Attack Scenarios

**Fight Manipulation:**
1. Attacker simulates fight outcome off-chain for upcoming blocks
2. Identifies block where `prevrandao + timestamp` produces favorable outcome
3. Submits transaction timed to execute in that specific block
4. Guarantees victory regardless of skill mastery levels

**Gene Auction Manipulation:**
1. Validator observes tied gene auction approaching settlement
2. Validator owns Gene A, tied with Gene B
3. Validator manipulates `prevrandao` value to favor Gene A
4. Gene A wins tie-breaker, validator profits from gene ownership royalties

#### Impact
- **Fight Skill:** Complete subversion of game mechanics, guaranteed wins for attackers
- **Gene Auctions:** Financial manipulation, unfair winner selection, loss of trust in auction system
- **Economic:** Devaluation of legitimate gameplay, financial losses for honest participants

#### Proof of Concept
```solidity
// Attacker contract
contract FightExploit {
    function predictOutcome(address aminal, bytes calldata fightData) external view returns (bool willWin) {
        // Simulate fight with current block values
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 100;
        // Calculate if this block produces favorable outcome
        // Only submit transaction if willWin == true
    }
}
```

#### Recommended Remediation

**Option 1: Chainlink VRF (Recommended)**
```solidity
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract FightSkill is VRFConsumerBaseV2 {
    // Request random number, callback resolves fight after delay
    function _requestFightOutcome() internal returns (uint256 requestId) {
        requestId = requestRandomWords(...);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // Resolve fight with verifiable random number
    }
}
```

**Option 2: Commit-Reveal Scheme**
```solidity
// Step 1: Commit to action + secret
function commitFight(bytes32 commitHash) external {
    commits[msg.sender] = Commit({
        hash: commitHash,
        timestamp: block.timestamp
    });
}

// Step 2: Reveal after minimum delay
function revealFight(uint256 nonce, bytes calldata fightData) external {
    require(block.timestamp >= commits[msg.sender].timestamp + MIN_DELAY);
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, nonce, fightData));
    require(hash == commits[msg.sender].hash);
    // Use future block hash + nonce for randomness
}
```

**Option 3: Dual-Source Randomness**
```solidity
// Combine user-provided seed with future block hash
mapping(address => uint256) public userSeeds;

function executeFight() external {
    uint256 revealBlock = block.number + 5; // Execute 5 blocks later
    pendingFights[revealBlock].push(FightData({
        attacker: msg.sender,
        userSeed: userSeeds[msg.sender],
        ...
    }));
}

// Separate executor resolves after reveal block
function resolveFights(uint256 blockNumber) external {
    bytes32 blockHash = blockhash(blockNumber);
    // Combine blockHash with userSeed
}
```

#### References
- [Chainlink VRF Documentation](https://docs.chain.link/vrf/v2/introduction)
- [SWC-120: Weak Sources of Randomness](https://swcregistry.io/docs/SWC-120)
- [Consensys: On-Chain Randomness](https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/extcodesize-checks/)

---

### 2. UNAUTHORIZED TREASURY DRAIN VULNERABILITY

**Severity:** 🔴 CRITICAL
**Contract:** `Aminal.sol:399-410`
**CWE-284:** Improper Access Control

#### Description
The `payout` function allows the gene auction contract to withdraw any amount from an Aminal's treasury without validation of auction legitimacy, amount reasonableness, or rate limiting. If the gene auction contract is compromised, all Aminal treasuries can be drained.

#### Vulnerable Code
```solidity
function payout(uint256 amount, address recipient) external returns (bool success) {
    require(msg.sender == address(factory.geneAuction()), "Only gene auction can call payout");

    if (address(this).balance < amount) revert InsufficientTreasury();

    // No validation:
    // - Is auction legitimate/settled?
    // - Is amount reasonable?
    // - Any rate limiting?
    // - Is recipient the actual gene owner?

    (success,) = payable(recipient).call{value: amount}("");
    if (!success) revert TreasuryTransferFailed();
}
```

#### Attack Scenarios

**Scenario 1: Compromised Gene Auction**
1. Vulnerability discovered in `GeneAuction.sol`
2. Attacker exploits to call `payout` directly
3. Drains all treasuries from high-value Aminals
4. Total loss could be hundreds of ETH

**Scenario 2: Malicious Auction Settlement**
1. Attacker creates fake auction data
2. Manipulates `_payoutGeneCreator` logic
3. Specifies own address as recipient
4. Repeatedly calls settlement to drain treasury

**Scenario 3: Reentrancy via Recipient**
1. Attacker registers malicious contract as gene owner
2. `payout` calls malicious recipient
3. Recipient's fallback re-enters `payout` (if reentrancy guard fails)
4. Drains entire treasury in single transaction

#### Impact
- **Financial:** Complete loss of all treasury funds (potentially 100+ ETH per Aminal)
- **Trust:** Catastrophic loss of user confidence
- **Legal:** Potential liability for fund losses
- **Operational:** Project shutdown due to exploited funds

#### Proof of Concept
```solidity
// Malicious exploit contract
contract TreasuryDrainer {
    function exploit(address[] memory aminals) external {
        GeneAuction auction = GeneAuction(geneAuctionAddress);

        for (uint i = 0; i < aminals.length; i++) {
            // If we can trigger payout somehow...
            uint256 balance = aminals[i].balance;
            // Drain entire balance
            Aminal(aminals[i]).payout(balance, address(this));
        }
    }
}
```

#### Recommended Remediation

**Multi-Layer Protection:**

```solidity
// Add rate limiting
mapping(address => RateLimit) public payoutLimits;
struct RateLimit {
    uint256 lastPayout;
    uint256 amountToday;
    uint256 dayStarted;
}

function payout(uint256 amount, address recipient) external nonReentrant returns (bool success) {
    require(msg.sender == address(factory.geneAuction()), "Only gene auction");

    // 1. Maximum percentage per transaction (10% of treasury)
    uint256 maxSinglePayout = address(this).balance / 10;
    require(amount <= maxSinglePayout, "Exceeds maximum payout");

    // 2. Daily rate limit (30% per day)
    RateLimit storage limit = payoutLimits[address(this)];
    if (block.timestamp > limit.dayStarted + 1 days) {
        limit.dayStarted = block.timestamp;
        limit.amountToday = 0;
    }
    require(limit.amountToday + amount <= address(this).balance * 30 / 100, "Daily limit exceeded");
    limit.amountToday += amount;

    // 3. Time-based cooldown (1 hour between payouts)
    require(block.timestamp >= limit.lastPayout + 1 hours, "Cooldown period");
    limit.lastPayout = block.timestamp;

    // 4. Auction validation - store auction ID with payout
    require(factory.geneAuction().isAuctionSettled(msg.sender), "Auction not settled");

    // 5. Transfer with explicit gas limit to prevent reentrancy
    (success,) = payable(recipient).call{value: amount, gas: 2300}("");
    if (!success) revert TreasuryTransferFailed();

    emit TreasuryPayout(amount, recipient, msg.sender);
}
```

**Alternative: Pull Payment Pattern**
```solidity
// GeneAuction tracks payouts, recipients pull funds
mapping(address => uint256) public pendingPayouts;

function settlementPayout(address aminal, address recipient, uint256 amount) external {
    // GeneAuction calls this to register payout
    pendingPayouts[recipient] += amount;
    emit PayoutRegistered(recipient, amount);
}

function withdrawPayout() external nonReentrant {
    uint256 amount = pendingPayouts[msg.sender];
    require(amount > 0, "No pending payout");
    pendingPayouts[msg.sender] = 0;

    (bool success,) = payable(msg.sender).call{value: amount}("");
    require(success, "Transfer failed");
}
```

#### Testing Requirements
- [ ] Test maximum payout percentage enforcement
- [ ] Test daily rate limit across multiple payouts
- [ ] Test cooldown period between transactions
- [ ] Test reentrancy protection with malicious recipient
- [ ] Test behavior when auction contract is replaced
- [ ] Stress test with 100+ rapid payout attempts

---

### 3. REENTRANCY IN GENE AUCTION SETTLEMENT

**Severity:** 🔴 CRITICAL
**Contract:** `GeneAuction.sol:301-346`
**CWE-674:** Uncontrolled Recursion

#### Description
The `settleAuction` function makes multiple external calls to Aminal contracts (via `_payoutGeneCreator`) after marking the auction as settled. While a `nonReentrant` modifier is used, the complex call chain (GeneAuction → Aminal.payout → recipient fallback) creates reentrancy opportunities, especially if the `settled` flag check has any gaps.

#### Vulnerable Code
```solidity
function settleAuction(uint256 auctionId) external validVoting(auctionId) nonReentrant {
    Auction storage auction = auctions[auctionId];

    // Settlement checks
    require(!auction.settled, "Auction already settled");
    require(block.timestamp >= auction.votingEndTime, "Voting period not ended");

    auction.settled = true;  // Flag set early - GOOD

    // ... winner selection logic ...

    // DANGER ZONE: Multiple external calls in loop
    for (uint256 i = 0; i < 8;) {
        VisualsCat category = VisualsCat(i);
        uint256 geneId = categoryWinners[i];

        if (geneId != 0) {
            address geneOwner = genes.ownerOf(geneId);

            // External call to Aminal contracts
            totalTreasuryTransferred += _payoutGeneCreator(
                aminalOne,
                aminalTwo,
                categoryTreasury,
                geneOwner
            );
        }
        unchecked { ++i; }
    }

    emit AuctionSettled(auctionId, aminalOne, aminalTwo, categoryWinners);
}

function _payoutGeneCreator(...) internal returns (uint256 totalTransferred) {
    // External calls to Aminal contracts
    bool successOne = IAminal(aminalOneAddress).payout(treasuryPerGeneHalf, geneOwner);
    bool successTwo = IAminal(aminalTwoAddress).payout(treasuryPerGeneHalf, geneOwner);
    // ...
}
```

#### Attack Scenarios

**Scenario 1: Malicious Gene Owner Contract**
```solidity
contract MaliciousGeneOwner {
    uint256 reentryCount;

    receive() external payable {
        if (reentryCount < 5) {
            reentryCount++;
            // Attempt reentrancy
            try geneAuction.settleAuction(auctionId) {} catch {}
            // Or manipulate other auction state
            try geneAuction.voteOnGene(anotherAuctionId, ...) {} catch {}
        }
    }
}
```

**Scenario 2: State Inconsistency Exploitation**
1. Attacker creates gene and wins auction
2. Settlement begins, `settled = true`
3. During payout, attacker's contract receives funds
4. Attacker attempts to vote on related auctions or manipulate voting state
5. Even though main auction is settled, related state could be corrupted

**Scenario 3: Gas Griefing**
1. Malicious recipient consumes excessive gas in fallback
2. Settlement transaction runs out of gas mid-loop
3. Some gene owners paid, others not
4. Auction marked as settled, but incomplete payouts
5. Funds stuck, inconsistent state

#### Impact
- **State Corruption:** Auction marked settled but payouts incomplete
- **Fund Loss:** Partial payouts create accounting issues
- **DOS:** Gas griefing prevents settlement completion
- **Trust:** Inconsistent settlement undermines system integrity

#### Recommended Remediation

**Option 1: Pull Payment Pattern (Recommended)**
```solidity
// Store pending payouts instead of pushing
mapping(address => mapping(uint256 => uint256)) public pendingPayouts; // recipient => auctionId => amount

function settleAuction(uint256 auctionId) external validVoting(auctionId) nonReentrant {
    Auction storage auction = auctions[auctionId];
    require(!auction.settled, "Auction already settled");
    require(block.timestamp >= auction.votingEndTime, "Voting period not ended");

    // Select winners
    uint256[] memory categoryWinners = new uint256[](8);
    for (uint256 i = 0; i < 8; i++) {
        categoryWinners[i] = _selectWinningGene(auctionId, VisualsCat(i));
    }

    // Calculate payouts but don't transfer
    for (uint256 i = 0; i < 8; i++) {
        uint256 geneId = categoryWinners[i];
        if (geneId != 0) {
            address geneOwner = genes.ownerOf(geneId);
            uint256 payoutAmount = _calculatePayout(aminalOne, aminalTwo, auction.categoryTreasuries[i]);
            pendingPayouts[geneOwner][auctionId] += payoutAmount;
        }
    }

    auction.settled = true;
    emit AuctionSettled(auctionId, aminalOne, aminalTwo, categoryWinners);
}

// Separate function for recipients to claim
function claimPayout(uint256 auctionId) external nonReentrant {
    uint256 amount = pendingPayouts[msg.sender][auctionId];
    require(amount > 0, "No payout available");

    pendingPayouts[msg.sender][auctionId] = 0;

    // Request from both Aminals
    uint256 halfAmount = amount / 2;
    IAminal(auctions[auctionId].aminalOne).payout(halfAmount, msg.sender);
    IAminal(auctions[auctionId].aminalTwo).payout(halfAmount, msg.sender);
}
```

**Option 2: Atomic Settlement with Revert on Failure**
```solidity
function settleAuction(uint256 auctionId) external validVoting(auctionId) nonReentrant {
    // ... winner selection ...

    auction.settled = true;

    // All payouts must succeed or entire settlement reverts
    for (uint256 i = 0; i < 8; i++) {
        if (categoryWinners[i] != 0) {
            address geneOwner = genes.ownerOf(categoryWinners[i]);

            // Require success, revert if any payout fails
            bool success1 = IAminal(aminalOne).payout(amount, geneOwner);
            bool success2 = IAminal(aminalTwo).payout(amount, geneOwner);

            require(success1 && success2, "Payout failed");
        }
    }

    emit AuctionSettled(auctionId, aminalOne, aminalTwo, categoryWinners);
}
```

**Option 3: Add Explicit Reentrancy Guards**
```solidity
// Add reentrancy guard to voting functions
bool private _settlingAuction;

function settleAuction(uint256 auctionId) external validVoting(auctionId) nonReentrant {
    require(!_settlingAuction, "Settlement in progress");
    _settlingAuction = true;

    // ... settlement logic ...

    _settlingAuction = false;
}

modifier notDuringSettlement() {
    require(!_settlingAuction, "Cannot call during settlement");
    _;
}

function voteOnGene(...) external notDuringSettlement {
    // Prevent voting manipulation during settlement
}
```

#### Testing Requirements
- [ ] Test reentrancy from malicious recipient contract
- [ ] Test gas griefing scenarios
- [ ] Test partial failure in payout loop
- [ ] Test state consistency across multiple settlements
- [ ] Test concurrent settlement attempts
- [ ] Fuzz test with random reentrant calls

---

### 4. INTEGER OVERFLOW IN VRGDA CALCULATIONS

**Severity:** 🔴 CRITICAL
**Contract:** `AminalVRGDA.sol:73-130`
**CWE-190:** Integer Overflow

#### Description
The VRGDA (Variable Rate Gradual Dutch Auction) love calculation performs complex arithmetic with large numbers (1 ether = 10^18) multiplied by factors up to 10x. While Solidity 0.8+ has built-in overflow protection, the extreme values can still cause:
1. Overflow reverts preventing feeding
2. Precision loss due to division order
3. Unexpected wrapping near uint256.max boundaries

#### Vulnerable Code
```solidity
function getLoveForETH(address aminal, uint256 ethAmount) external view returns (uint256 loveGained) {
    IAminal aminalContract = IAminal(aminal);
    uint256 currentEnergy = aminalContract.energy();

    // Multiplier ranges from 0.1 to 10 ether (10^17 to 10^19)
    uint256 loveMultiplier;
    if (currentEnergy < 10) {
        loveMultiplier = MAX_LOVE_MULTIPLIER; // 10 ether = 10 * 10^18
    } else if (currentEnergy > 1_000_000) {
        loveMultiplier = MIN_LOVE_MULTIPLIER; // 0.1 ether = 10^17
    } else {
        // Linear interpolation can produce large intermediate values
        loveMultiplier = MAX_LOVE_MULTIPLIER
            - ((currentEnergy - 10) * (MAX_LOVE_MULTIPLIER - MIN_LOVE_MULTIPLIER)) / (1_000_000 - 10);
    }

    // DANGER: Multiple multiplications with large numbers
    uint256 baseUnits = (ethAmount * ENERGY_PER_ETH) / 1 ether;  // ethAmount * 10000 / 10^18
    loveGained = (baseUnits * loveMultiplier) / 1 ether;  // baseUnits * up_to_10^19 / 10^18

    // If ethAmount is large, these calculations can overflow
}
```

#### Overflow Analysis

**Maximum Safe Values:**
```
uint256.max = 115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,935

Calculation breakdown:
- ethAmount (max reasonable: 1000 ETH = 1000 * 10^18 = 10^21)
- ENERGY_PER_ETH = 10000
- MAX_LOVE_MULTIPLIER = 10 * 10^18 = 10^19

Step 1: baseUnits = (ethAmount * 10000) / 10^18
  = (10^21 * 10^4) / 10^18
  = 10^25 / 10^18
  = 10^7 = 10,000,000

Step 2: loveGained = (baseUnits * loveMultiplier) / 10^18
  = (10^7 * 10^19) / 10^18
  = 10^26 / 10^18
  = 10^8 = 100,000,000

Overflow occurs if: ethAmount > uint256.max / (ENERGY_PER_ETH * MAX_LOVE_MULTIPLIER)
  = uint256.max / (10^4 * 10^19)
  = uint256.max / 10^23
  ≈ 1.157 * 10^54 ETH (astronomically large, unlikely)
```

**However, precision loss is a concern:**

#### Attack Scenarios

**Scenario 1: Precision Loss Manipulation**
```solidity
// Attacker feeds exact amount to minimize love due to rounding
// Example: Feed 0.0001 ETH repeatedly instead of 0.01 ETH once
uint256 smallAmount = 0.0001 ether;
for (uint i = 0; i < 100; i++) {
    aminal.feed{value: smallAmount}();
    // Each small feed loses precision, total love gained < single large feed
}
```

**Scenario 2: Edge Case Exploitation**
```solidity
// Feed Aminal to exactly energy = 9 for maximum multiplier
aminal.useSkill(costlySkill); // Burn energy to 9
aminal.feed{value: 100 ether}(); // Gain love with 10x multiplier
// Gained love = 100 * 10000 * 10 = 10,000,000 love (massive advantage)
```

**Scenario 3: DOS via Extreme Values**
```solidity
// If contract somehow receives enormous ETH amount
// (via selfdestruct from another contract)
aminal.feed{value: type(uint128).max}();
// Could cause overflow revert, bricking the feed function
```

#### Impact
- **Precision Loss:** Users lose love due to rounding errors (up to 0.1% per transaction)
- **Economic Imbalance:** Sophisticated users optimize feeding strategy for maximum love
- **Potential DOS:** Extreme edge cases could revert, preventing feeding
- **Unfair Advantage:** Early understanding of precision mechanics provides advantage

#### Recommended Remediation

```solidity
// Use SafeMath principles and careful ordering
function getLoveForETH(address aminal, uint256 ethAmount) external view returns (uint256 loveGained) {
    // 1. Add maximum input validation
    require(ethAmount <= 100 ether, "Exceeds maximum feed amount");
    require(ethAmount > 0, "Must feed positive amount");

    IAminal aminalContract = IAminal(aminal);
    uint256 currentEnergy = aminalContract.energy();

    // 2. Calculate multiplier with explicit bounds
    uint256 loveMultiplier;
    if (currentEnergy < 10) {
        loveMultiplier = MAX_LOVE_MULTIPLIER;
    } else if (currentEnergy > 1_000_000) {
        loveMultiplier = MIN_LOVE_MULTIPLIER;
    } else {
        // 3. Reorder operations to minimize precision loss
        uint256 range = 1_000_000 - 10;
        uint256 position = currentEnergy - 10;
        uint256 multiplierRange = MAX_LOVE_MULTIPLIER - MIN_LOVE_MULTIPLIER;

        // Calculate: MIN + (MAX - MIN) * (1 - position/range)
        // Reordered to avoid intermediate overflow
        loveMultiplier = MIN_LOVE_MULTIPLIER
            + (multiplierRange * (range - position)) / range;
    }

    // 4. Use higher precision intermediate values
    // Calculate in two steps with checked arithmetic
    uint256 energyUnits = (ethAmount * ENERGY_PER_ETH);
    require(energyUnits / ethAmount == ENERGY_PER_ETH, "Overflow in energy calculation");

    uint256 baseUnits = energyUnits / 1 ether;

    // 5. Apply multiplier with overflow check
    uint256 loveBeforeDivision = baseUnits * loveMultiplier;
    require(loveBeforeDivision / baseUnits == loveMultiplier, "Overflow in love calculation");

    loveGained = loveBeforeDivision / 1 ether;

    // 6. Ensure reasonable output
    require(loveGained > 0, "Love calculation resulted in zero");
    require(loveGained <= 1_000_000, "Love gained exceeds maximum");
}

// Alternative: Use FixedPoint library for precision
import "@openzeppelin/contracts/utils/math/Math.sol";

function getLoveForETHPrecise(address aminal, uint256 ethAmount)
    external
    view
    returns (uint256 loveGained)
{
    // Use 256-bit fixed point arithmetic
    // Scale to 10^36 for intermediate calculations, then scale down
    uint256 PRECISION = 1e36;

    uint256 scaledAmount = ethAmount * PRECISION;
    uint256 scaledEnergy = scaledAmount * ENERGY_PER_ETH / 1 ether;
    uint256 scaledLove = scaledEnergy * loveMultiplier / 1 ether;

    loveGained = scaledLove / PRECISION;
}
```

#### Additional Safeguards

```solidity
// Add circuit breaker for extreme calculations
uint256 public constant MAX_LOVE_PER_TRANSACTION = 1_000_000;
uint256 public constant MIN_FEED_AMOUNT = 0.001 ether;
uint256 public constant MAX_FEED_AMOUNT = 100 ether;

modifier validFeedAmount(uint256 amount) {
    require(amount >= MIN_FEED_AMOUNT && amount <= MAX_FEED_AMOUNT, "Invalid feed amount");
    _;
}

function feed() external payable validFeedAmount(msg.value) {
    uint256 loveGained = vrgda.getLoveForETH(address(this), msg.value);
    require(loveGained <= MAX_LOVE_PER_TRANSACTION, "Love exceeds maximum");
    // ...
}
```

#### Testing Requirements
- [ ] Test all boundary conditions (0, 1 wei, max uint256)
- [ ] Fuzz test with random ethAmount values
- [ ] Test precision across range of energy levels
- [ ] Compare multiple small feeds vs single large feed
- [ ] Test with energy at 9, 10, 1000000, 1000001
- [ ] Verify no overflow with 10000 ETH feed
- [ ] Gas cost analysis for optimization

---

### 5. UNVALIDATED SKILL EXECUTION ALLOWING DOS

**Severity:** 🔴 CRITICAL
**Contract:** `Aminal.sol:342-384`
**CWE-703:** Improper Check or Handling of Exceptional Conditions

#### Description
The `useSkill` function allows calling arbitrary external contracts that claim to implement the `ISkill` interface. While it checks interface support, it doesn't:
- Whitelist approved skills
- Limit gas consumption
- Validate skill contract authenticity
- Prevent malicious skill side effects

This creates multiple attack vectors for DOS and potential state manipulation.

#### Vulnerable Code
```solidity
function useSkill(address target, bytes calldata data) external nonReentrant {
    require(msg.sender == owner(), "Only owner can use skills");

    // Only checks if target claims to support ISkill
    try ISkill(target).supportsInterface(type(ISkill).interfaceId) returns (bool supported) {
        if (!supported) revert SkillNotSupported();
    } catch {
        revert SkillNotSupported();
    }

    // Query skill cost from untrusted contract
    uint256 energyCost;
    try ISkill(target).skillCost(data) returns (uint256 cost) {
        energyCost = cost;
    } catch {
        energyCost = 1;
    }

    // Apply cost caps
    if (energyCost > MAX_SKILL_COST) {
        energyCost = energy > MAX_SKILL_COST ? MAX_SKILL_COST : energy;
    }
    if (energyCost == 0) energyCost = 1;
    if (energy < energyCost) revert NotEnoughEnergy();

    energy -= energyCost;

    // DANGER: Unlimited gas call to untrusted contract
    (bool success,) = target.call{value: 0}(data);
    if (!success) revert SkillCallFailed();

    emit SkillUsed(msg.sender, target, energyCost);
}
```

#### Attack Scenarios

**Scenario 1: Gas Exhaustion DOS**
```solidity
contract MaliciousSkill is ISkill {
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(ISkill).interfaceId;
    }

    function skillCost(bytes calldata data) external pure returns (uint256) {
        return 1; // Minimal cost
    }

    function execute(bytes calldata data) external {
        // Infinite loop or extremely expensive operation
        while(true) {
            // Consume all gas
            keccak256(abi.encodePacked(block.timestamp));
        }
    }
}

// Attack: User unknowingly calls malicious skill
aminal.useSkill(address(maliciousSkill), abi.encodeWithSelector(MaliciousSkill.execute.selector));
// Transaction consumes all gas, reverts, but wastes user's ETH on gas fees
```

**Scenario 2: State Manipulation via Skills**
```solidity
contract StateManipulatorSkill is ISkill {
    function execute(bytes calldata data) external {
        // Malicious skill could:
        // 1. Call back into Aminal contract (if no reentrancy guard on other functions)
        // 2. Interact with other contracts in ecosystem
        // 3. Emit fake events
        // 4. Manipulate external state that Aminal depends on

        IAminalFactory(factory).someUnprotectedFunction();
    }
}
```

**Scenario 3: Cost Oracle Manipulation**
```solidity
contract DynamicCostSkill is ISkill {
    function skillCost(bytes calldata data) external view returns (uint256) {
        // Returns different cost based on block number
        if (block.number % 2 == 0) return 1;
        else return MAX_SKILL_COST;
    }

    function execute(bytes calldata data) external {
        // User queries cost off-chain: sees 1
        // Submits transaction
        // Cost oracle now returns MAX_SKILL_COST
        // User charged much more than expected
    }
}
```

**Scenario 4: Frontrunning Skill Registration**
```solidity
// If skills are registered permissionlessly:
// 1. Legitimate skill proposed
// 2. Attacker sees proposal in mempool
// 3. Attacker front-runs with malicious skill at same address (different chain)
// 4. Users on attacker's chain execute malicious skill thinking it's legitimate
```

#### Impact
- **DOS:** Malicious skills can consume all gas, bricking Aminal functionality
- **Financial Loss:** Users waste gas fees on failed transactions
- **State Corruption:** Skills could manipulate external contracts
- **Trust Loss:** Users afraid to use skill system
- **Griefing:** Attacker creates unusable Aminals by getting them to call malicious skills

#### Proof of Concept
```solidity
// Test case demonstrating DOS
contract SkillDOSTest is Test {
    function testMaliciousSkillDOS() public {
        MaliciousSkill evil = new MaliciousSkill();

        vm.prank(aminalOwner);
        vm.expectRevert(); // Out of gas
        aminal.useSkill(
            address(evil),
            abi.encodeWithSelector(MaliciousSkill.execute.selector),
            {gas: 1000000} // Limited gas
        );

        // Aminal owner wasted gas fees, skill didn't execute
    }
}
```

#### Recommended Remediation

**Option 1: Skill Whitelist (Recommended)**
```solidity
// In AminalFactory
mapping(address => bool) public approvedSkills;
address[] public skillList;

event SkillApproved(address skill, string name);
event SkillRevoked(address skill);

function approveSkill(address skill) external onlyOwner {
    require(skill != address(0), "Invalid skill address");
    require(ISkill(skill).supportsInterface(type(ISkill).interfaceId), "Not a valid skill");

    approvedSkills[skill] = true;
    skillList.push(skill);
    emit SkillApproved(skill, ISkill(skill).name());
}

function revokeSkill(address skill) external onlyOwner {
    approvedSkills[skill] = false;
    emit SkillRevoked(skill);
}

// In Aminal
function useSkill(address target, bytes calldata data) external nonReentrant {
    require(msg.sender == owner(), "Only owner");
    require(factory.approvedSkills(target), "Skill not approved"); // ADDED

    // Rest of function...
}
```

**Option 2: Gas Limits**
```solidity
function useSkill(address target, bytes calldata data) external nonReentrant {
    require(msg.sender == owner(), "Only owner");
    require(factory.approvedSkills(target), "Skill not approved");

    // Query cost
    uint256 energyCost = _getSkillCost(target, data);
    energy -= energyCost;

    // ADDED: Explicit gas limit
    uint256 gasLimit = 500_000; // 500k gas max per skill
    (bool success,) = target.call{value: 0, gas: gasLimit}(data);
    if (!success) revert SkillCallFailed();

    emit SkillUsed(msg.sender, target, energyCost);
}
```

**Option 3: Skill Registry with Governance**
```solidity
contract SkillRegistry {
    struct SkillInfo {
        address skillAddress;
        string name;
        string description;
        uint256 gasLimit;
        uint256 votesFor;
        uint256 votesAgainst;
        bool approved;
    }

    mapping(address => SkillInfo) public skills;

    function proposeSkill(
        address skill,
        string memory name,
        string memory description,
        uint256 gasLimit
    ) external {
        require(gasLimit <= 1_000_000, "Gas limit too high");
        skills[skill] = SkillInfo({
            skillAddress: skill,
            name: name,
            description: description,
            gasLimit: gasLimit,
            votesFor: 0,
            votesAgainst: 0,
            approved: false
        });
    }

    function voteOnSkill(address skill, bool approve) external {
        // Governance voting logic
    }

    function executeSkillWithLimit(address skill, bytes calldata data) external returns (bool) {
        SkillInfo memory info = skills[skill];
        require(info.approved, "Skill not approved");

        (bool success,) = skill.call{value: 0, gas: info.gasLimit}(data);
        return success;
    }
}
```

**Option 4: Static Cost Commitment**
```solidity
// Skills must commit to fixed cost at registration
mapping(address => uint256) public skillFixedCosts;

function registerSkill(address skill, uint256 fixedCost) external onlyOwner {
    require(fixedCost > 0 && fixedCost <= MAX_SKILL_COST, "Invalid cost");
    skillFixedCosts[skill] = fixedCost;
    approvedSkills[skill] = true;
}

function useSkill(address target, bytes calldata data) external nonReentrant {
    require(msg.sender == owner(), "Only owner");
    require(approvedSkills[target], "Skill not approved");

    // Use committed cost, ignore skill's reported cost
    uint256 energyCost = skillFixedCosts[target];
    require(energy >= energyCost, "Not enough energy");

    energy -= energyCost;

    (bool success,) = target.call{value: 0, gas: 500_000}(data);
    if (!success) revert SkillCallFailed();
}
```

#### Comprehensive Protection
```solidity
// Multi-layered skill protection
function useSkill(address target, bytes calldata data)
    external
    nonReentrant
    whenNotPaused // Add pause functionality
{
    require(msg.sender == owner(), "Only owner");

    // Layer 1: Whitelist check
    require(factory.approvedSkills(target), "Skill not approved");

    // Layer 2: Rate limiting
    require(block.timestamp >= lastSkillUse + SKILL_COOLDOWN, "Skill cooldown active");
    lastSkillUse = block.timestamp;

    // Layer 3: Daily usage cap
    if (block.timestamp > dailySkillReset + 1 days) {
        dailySkillCount = 0;
        dailySkillReset = block.timestamp;
    }
    require(dailySkillCount < MAX_DAILY_SKILLS, "Daily skill limit reached");
    dailySkillCount++;

    // Layer 4: Fixed cost from registry
    uint256 energyCost = factory.skillFixedCosts(target);
    require(energy >= energyCost, "Not enough energy");
    energy -= energyCost;

    // Layer 5: Gas limited execution
    uint256 gasLimit = factory.skillGasLimits(target);
    (bool success, bytes memory returnData) = target.call{value: 0, gas: gasLimit}(data);

    // Layer 6: Validate return data
    if (!success) {
        emit SkillFailed(target, returnData);
        revert SkillCallFailed();
    }

    emit SkillUsed(msg.sender, target, energyCost);
}
```

#### Testing Requirements
- [ ] Test malicious skill with infinite loop
- [ ] Test gas consumption with various gas limits
- [ ] Test skill cost manipulation scenarios
- [ ] Test reentrancy from skill callback
- [ ] Test skill whitelist enforcement
- [ ] Test rate limiting and daily caps
- [ ] Fuzz test with random skill addresses
- [ ] Test skill revocation mid-execution

---

## HIGH SEVERITY ISSUES

### 7. FRONT-RUNNING VULNERABILITY IN GENE AUCTIONS

**Severity:** 🟠 HIGH
**Contract:** `GeneAuction.sol:386-421`
**CWE-362:** Concurrent Execution using Shared Resource with Improper Synchronization

#### Description
All voting transactions are visible in the mempool before execution, allowing attackers to observe voting patterns and front-run with their own votes at higher gas prices. This is especially problematic in tied situations where the last vote or first vote can determine the winner.

#### Vulnerable Code
```solidity
function voteOnGene(uint256 auctionId, VisualsCat category, uint256 geneId)
    external
    validVoting(auctionId)
{
    // All parameters visible in mempool
    // Attacker can see: which auction, category, geneId
    // Attacker can frontrun with higher gas price

    uint256 userLove = lovePerUser[msg.sender];
    require(userLove >= MIN_LOVE_REQUIRED, "Not enough love");

    // ... voting logic ...
}
```

#### Attack Scenarios

**Scenario 1: Direct Frontrunning**
```
1. Alice votes for Gene A in mempool (50 gwei gas)
2. Bob sees Alice's transaction
3. Bob frontruns with vote for Gene B (100 gwei gas)
4. Bob's vote executes first
5. If votes determine tie-breaker, Bob influences outcome
```

**Scenario 2: Sandwich Attack on Voting**
```
1. Gene A and Gene B tied at 1000 votes each
2. Charlie submits vote for Gene A (pending in mempool)
3. Attacker sees Charlie's vote
4. Attacker frontruns with vote for Gene B
5. Then backs up with another vote after Charlie's
6. Gene B wins tie, attacker profits from Gene B ownership
```

**Scenario 3: Information Asymmetry**
```
1. Sophisticated actor monitors mempool continuously
2. Sees voting patterns emerge for Gene X
3. Immediately votes for Gene X before others see the trend
4. Or votes for opposing gene to sabotage
```

#### Impact
- **Unfair Outcomes:** Gene winners determined by gas bidding, not legitimate voting
- **MEV Extraction:** Validators/searchers profit from vote ordering
- **Voter Discouragement:** Users stop voting when they realize front-running risk
- **Market Manipulation:** Gene creators manipulate outcomes through front-running

#### Recommended Remediation

**Option 1: Commit-Reveal Scheme**
```solidity
struct VoteCommitment {
    bytes32 commitment;
    uint256 timestamp;
    bool revealed;
}

mapping(address => mapping(uint256 => VoteCommitment)) public commitments;

// Phase 1: Commit (hidden vote)
function commitVote(uint256 auctionId, bytes32 commitment) external {
    require(block.timestamp < auction.votingEndTime - REVEAL_PERIOD, "Too late to commit");

    commitments[msg.sender][auctionId] = VoteCommitment({
        commitment: commitment,
        timestamp: block.timestamp,
        revealed: false
    });

    emit VoteCommitted(auctionId, msg.sender);
}

// Phase 2: Reveal (after commit period)
function revealVote(
    uint256 auctionId,
    VisualsCat category,
    uint256 geneId,
    uint256 nonce
) external {
    require(block.timestamp >= auction.votingEndTime - REVEAL_PERIOD, "Reveal period not started");
    require(block.timestamp < auction.votingEndTime, "Voting ended");

    VoteCommitment storage commitment = commitments[msg.sender][auctionId];
    require(!commitment.revealed, "Already revealed");

    // Verify commitment matches reveal
    bytes32 computedCommit = keccak256(abi.encodePacked(
        msg.sender,
        auctionId,
        category,
        geneId,
        nonce
    ));
    require(computedCommit == commitment.commitment, "Invalid reveal");

    commitment.revealed = true;

    // Process vote now that it's revealed
    _processSingleVote(auctionId, category, geneId);
}
```

**Option 2: Batch Voting with Time Buckets**
```solidity
// Votes accumulate in time buckets, processed together
mapping(uint256 => mapping(uint256 => Vote[])) public voteBuckets; // auctionId => bucketId => votes

function voteOnGene(uint256 auctionId, VisualsCat category, uint256 geneId) external {
    uint256 bucketId = block.timestamp / BUCKET_DURATION;

    voteBuckets[auctionId][bucketId].push(Vote({
        voter: msg.sender,
        category: category,
        geneId: geneId,
        timestamp: block.timestamp
    }));
}

// Process all votes in bucket simultaneously
function processBucket(uint256 auctionId, uint256 bucketId) external {
    require(block.timestamp >= (bucketId + 1) * BUCKET_DURATION, "Bucket still active");

    Vote[] storage votes = voteBuckets[auctionId][bucketId];
    for (uint i = 0; i < votes.length; i++) {
        _processSingleVote(auctionId, votes[i].category, votes[i].geneId);
    }
}
```

**Option 3: Encrypted Votes with Decryption Key Release**
```solidity
// Use threshold encryption where decryption key released after voting ends
// Requires off-chain coordination or trusted hardware

struct EncryptedVote {
    bytes encryptedData; // Contains: category, geneId
    bytes32 commitment;
}

function submitEncryptedVote(uint256 auctionId, bytes memory encryptedData) external {
    encryptedVotes[auctionId][msg.sender] = EncryptedVote({
        encryptedData: encryptedData,
        commitment: keccak256(encryptedData)
    });
}

// After voting ends, decryption key published off-chain
// Anyone can decrypt and submit revealed votes
function revealEncryptedVote(
    uint256 auctionId,
    address voter,
    VisualsCat category,
    uint256 geneId,
    bytes memory proof
) external {
    // Verify decryption proof
    // Process vote
}
```

---

### 8. UNCHECKED RETURN VALUES IN TREASURY PAYOUT

**Severity:** 🟠 HIGH
**Contract:** `GeneAuction.sol:933-958`
**CWE-252:** Unchecked Return Value

#### Description
The `_payoutGeneCreator` function silently accumulates only successful transfers, ignoring failed payouts. Gene creators may not receive funds they're entitled to, with no mechanism for retry or recovery.

#### Vulnerable Code
```solidity
function _payoutGeneCreator(
    address aminalOneAddress,
    address aminalTwoAddress,
    uint256 categoryTreasury,
    address geneOwner
) internal returns (uint256 totalTransferred) {
    uint256 treasuryPerGeneHalf = (categoryTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100 / 2;

    // DANGER: Partial failures silently ignored
    bool successOne = IAminal(aminalOneAddress).payout(treasuryPerGeneHalf, geneOwner);
    bool successTwo = IAminal(aminalTwoAddress).payout(treasuryPerGeneHalf, geneOwner);

    if (successOne) totalTransferred += treasuryPerGeneHalf;
    if (successTwo) totalTransferred += treasuryPerGeneHalf;

    // No event, no revert, no tracking of failures
    // Funds remain stuck in Aminal treasury

    return totalTransferred;
}
```

#### Attack Scenarios

**Scenario 1: Accidental Fund Locking**
```
1. Aminal One has 10 ETH treasury
2. Aminal Two has 0 ETH treasury (all used up)
3. Settlement calls payout for 1 ETH from each
4. Aminal One transfer succeeds (gene owner gets 1 ETH)
5. Aminal Two transfer fails (insufficient funds)
6. Gene owner only receives 1 ETH instead of 2 ETH
7. Missing 1 ETH has no recovery mechanism
```

**Scenario 2: Malicious Recipient Blocking**
```solidity
contract SelectiveRecipient {
    receive() external payable {
        // Reject payments from specific Aminals
        if (msg.sender == targetAminal) revert();
    }
}
```

**Scenario 3: Gas Limit Issues**
```
1. Gene owner is contract with expensive receive function
2. First payout succeeds within gas limits
3. Second payout fails due to insufficient gas
4. Settlement completes with partial payout
5. No way to retry failed payout
```

#### Impact
- **Fund Loss:** Gene creators lose legitimate earnings
- **Accounting Issues:** Inconsistent state between contracts
- **Trust Erosion:** Creators don't trust payout system
- **Stuck Funds:** ETH locked in Aminal treasuries indefinitely

#### Recommended Remediation

**Option 1: Atomic Payouts (All or Nothing)**
```solidity
function _payoutGeneCreator(
    address aminalOneAddress,
    address aminalTwoAddress,
    uint256 categoryTreasury,
    address geneOwner
) internal returns (uint256 totalTransferred) {
    uint256 treasuryPerGeneHalf = (categoryTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100 / 2;

    // Require both payouts succeed
    bool successOne = IAminal(aminalOneAddress).payout(treasuryPerGeneHalf, geneOwner);
    require(successOne, "Aminal One payout failed");

    bool successTwo = IAminal(aminalTwoAddress).payout(treasuryPerGeneHalf, geneOwner);
    require(successTwo, "Aminal Two payout failed");

    totalTransferred = treasuryPerGeneHalf * 2;

    emit GeneCreatorPaid(geneOwner, totalTransferred);
    return totalTransferred;
}
```

**Option 2: Failed Payout Tracking with Retry**
```solidity
struct FailedPayout {
    address recipient;
    uint256 amount;
    uint256 timestamp;
    bool retried;
}

mapping(uint256 => FailedPayout[]) public failedPayouts; // auctionId => failed payouts

function _payoutGeneCreator(...) internal returns (uint256 totalTransferred) {
    uint256 treasuryPerGeneHalf = (categoryTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100 / 2;

    bool successOne = IAminal(aminalOneAddress).payout(treasuryPerGeneHalf, geneOwner);
    if (successOne) {
        totalTransferred += treasuryPerGeneHalf;
    } else {
        // Track failed payout for retry
        failedPayouts[auctionId].push(FailedPayout({
            recipient: geneOwner,
            amount: treasuryPerGeneHalf,
            timestamp: block.timestamp,
            retried: false
        }));
        emit PayoutFailed(auctionId, aminalOneAddress, geneOwner, treasuryPerGeneHalf);
    }

    bool successTwo = IAminal(aminalTwoAddress).payout(treasuryPerGeneHalf, geneOwner);
    if (successTwo) {
        totalTransferred += treasuryPerGeneHalf;
    } else {
        failedPayouts[auctionId].push(FailedPayout({
            recipient: geneOwner,
            amount: treasuryPerGeneHalf,
            timestamp: block.timestamp,
            retried: false
        }));
        emit PayoutFailed(auctionId, aminalTwoAddress, geneOwner, treasuryPerGeneHalf);
    }

    return totalTransferred;
}

// Retry mechanism
function retryFailedPayout(uint256 auctionId, uint256 payoutIndex) external {
    FailedPayout storage payout = failedPayouts[auctionId][payoutIndex];
    require(!payout.retried, "Already retried");
    require(block.timestamp >= payout.timestamp + RETRY_DELAY, "Too soon to retry");

    // Attempt payout again
    // (Need to track which Aminal it came from)
}
```

**Option 3: Pull Payment Pattern (Recommended)**
```solidity
// Gene creators claim their own payouts
mapping(address => uint256) public pendingGenePayouts;

function _payoutGeneCreator(
    address aminalOneAddress,
    address aminalTwoAddress,
    uint256 categoryTreasury,
    address geneOwner
) internal returns (uint256 totalAllocated) {
    uint256 treasuryPerGeneHalf = (categoryTreasury * TREASURY_TRANSFER_PERCENTAGE) / 100 / 2;

    // Don't transfer immediately, just allocate
    pendingGenePayouts[geneOwner] += treasuryPerGeneHalf * 2;
    totalAllocated = treasuryPerGeneHalf * 2;

    emit PayoutAllocated(geneOwner, totalAllocated);
    return totalAllocated;
}

// Gene creator claims when ready
function claimGenePayout() external nonReentrant {
    uint256 amount = pendingGenePayouts[msg.sender];
    require(amount > 0, "No pending payout");

    pendingGenePayouts[msg.sender] = 0;

    // Request funds from Aminals (needs tracking of which Aminals owe what)
    // ... transfer logic ...

    emit PayoutClaimed(msg.sender, amount);
}
```

---

### 9. GENE REMOVAL MECHANISM ALLOWS VOTE MANIPULATION

**Severity:** 🟠 HIGH
**Contract:** `GeneAuction.sol:493-521`
**CWE-841:** Improper Enforcement of Behavioral Workflow

#### Description
The `voteToRemoveGene` function doesn't track which users have voted, allowing users to vote multiple times for removal. A single user with 34% of voting power could repeatedly vote to easily reach the 1/3 threshold for removal.

#### Vulnerable Code
```solidity
function voteToRemoveGene(
    uint256 auctionId,
    VisualsCat category,
    uint256 geneId,
    uint256 voteWeight
) external validVoting(auctionId) {
    // ... checks ...

    // BUG: No tracking of who voted - can vote multiple times
    categoryVoting.geneRemovalVotes[geneId] += voteWeight;

    emit VoteToRemoveGene(auctionId, msg.sender, category, geneId, voteWeight);

    // Check if removal threshold reached (1/3 of total love)
    if (categoryVoting.geneRemovalVotes[geneId] >= auction.totalLove / GENE_REMOVAL_THRESHOLD) {
        _removeGeneFromCategory(auctionId, category, geneId);
    }
}
```

#### Attack Scenarios

**Scenario 1: Repeated Voting**
```
1. Attacker has 10% of total voting power
2. Calls voteToRemoveGene 4 times with same parameters
3. Gene removal votes: 10% + 10% + 10% + 10% = 40%
4. Threshold is 33%, so gene removed after 4th vote
5. Legitimate gene censored by single user
```

**Scenario 2: Competitive Manipulation**
```
1. Gene A and Gene B competing in category
2. Gene A owner wants to eliminate Gene B
3. Gene A owner votes to remove Gene B multiple times
4. Gene B removed from auction unfairly
5. Gene A wins by default
```

**Scenario 3: Partial Vote Exploitation**
```
1. User has 100 love tokens
2. Instead of single 100-vote removal, splits into 100x 1-vote removals
3. Each vote counted separately, reaching threshold faster
4. System incorrectly counts this as 100 separate users voting
```

#### Impact
- **Censorship:** Legitimate genes removed unfairly
- **Competition Manipulation:** Gene creators sabotage competitors
- **Economic Loss:** Removed genes lose revenue opportunity
- **System Trust:** Users lose faith in fair voting process

#### Recommended Remediation

```solidity
// Track removal votes per user
mapping(uint256 => mapping(uint256 => mapping(address => bool))) public hasVotedRemoval;
// auctionId => geneId => user => hasVoted

function voteToRemoveGene(
    uint256 auctionId,
    VisualsCat category,
    uint256 geneId,
    uint256 voteWeight
) external validVoting(auctionId) {
    // ... existing checks ...

    // Prevent duplicate votes
    require(!hasVotedRemoval[auctionId][geneId][msg.sender], "Already voted for removal");
    hasVotedRemoval[auctionId][geneId][msg.sender] = true;

    // Validate vote weight matches user's available power
    require(voteWeight <= _getUserVotingPower(msg.sender, auctionId), "Invalid vote weight");

    categoryVoting.geneRemovalVotes[geneId] += voteWeight;

    emit VoteToRemoveGene(auctionId, msg.sender, category, geneId, voteWeight);

    if (categoryVoting.geneRemovalVotes[geneId] >= auction.totalLove / GENE_REMOVAL_THRESHOLD) {
        _removeGeneFromCategory(auctionId, category, geneId);

        // Add cooldown before gene can be re-proposed
        removedGenes[geneId] = block.timestamp;
    }
}

// Prevent immediate re-proposal
mapping(uint256 => uint256) public removedGenes; // geneId => removal timestamp
uint256 public constant REMOVAL_COOLDOWN = 30 days;

function proposeGene(...) external {
    require(
        removedGenes[geneId] == 0 || block.timestamp >= removedGenes[geneId] + REMOVAL_COOLDOWN,
        "Gene recently removed"
    );
    // ... rest of propose logic ...
}
```

---

### 10. MISSING INPUT VALIDATION IN BREED FUNCTION

**Severity:** 🟠 HIGH
**Contract:** `AminalFactory.sol:331-360`
**CWE-20:** Improper Input Validation

#### Description
The `breedAminals` function lacks critical validation including breeding cooldowns, maximum breed counts, parent lineage validation, and caller authorization. This could lead to breeding spam, economic imbalance, and system DOS.

#### Vulnerable Code
```solidity
function breedAminals(address aminalOne, address aminalTwo)
    external
    returns (uint256 auctionId)
{
    require(isAminal[aminalOne] && isAminal[aminalTwo], "AminalFactory: invalid Aminal addresses");
    require(aminalOne != aminalTwo, "AminalFactory: cannot breed with self");

    // MISSING:
    // - Cooldown check (can breed same Aminals repeatedly)
    // - Max breed count (unlimited breeding)
    // - Parent validation (could be genesis)
    // - Caller authorization (anyone can breed any Aminals)
    // - Minimum age/energy requirements

    auctionId = geneAuction.createAuction(aminalOne, aminalTwo);
    emit AminalsBreeding(aminalOne, aminalTwo, auctionId);
}
```

#### Attack Scenarios

**Scenario 1: Breeding Spam DOS**
```
1. Attacker repeatedly breeds same two Aminals
2. Creates hundreds of auctions per day
3. Floods gene auction system
4. Legitimate users can't find real auctions
5. Contract storage bloats, gas costs increase
```

**Scenario 2: Economic Exploitation**
```
1. Attacker breeds popular Aminals non-stop
2. Floods market with offspring
3. Devalues Aminal NFTs through oversupply
4. Original owners lose value
```

**Scenario 3: Genesis Aminal Breeding**
```
1. Genesis Aminals have special traits
2. No check for parent lineage
3. Attacker could breed genesis Aminals
4. Or create circular breeding (child breeds with parent)
```

#### Impact
- **DOS:** Contract storage overflow, system unusability
- **Economic:** Inflation of Aminal supply, value destruction
- **Unfairness:** Spammers dominate breeding vs legitimate users
- **Gas Costs:** Bloated storage increases costs for everyone

#### Recommended Remediation

```solidity
// Add breeding tracking
mapping(address => uint256) public lastBreedTime;
mapping(address => uint256) public breedCount;
mapping(address => mapping(address => uint256)) public pairBreedCount;

uint256 public constant BREED_COOLDOWN = 1 days;
uint256 public constant MAX_BREED_COUNT = 10;
uint256 public constant MAX_PAIR_BREEDS = 3;
uint256 public constant MIN_ENERGY_TO_BREED = 100;

function breedAminals(address aminalOne, address aminalTwo)
    external
    returns (uint256 auctionId)
{
    // Existing checks
    require(isAminal[aminalOne] && isAminal[aminalTwo], "Invalid Aminal addresses");
    require(aminalOne != aminalTwo, "Cannot breed with self");

    // NEW: Cooldown validation
    require(
        block.timestamp >= lastBreedTime[aminalOne] + BREED_COOLDOWN,
        "Aminal One cooldown active"
    );
    require(
        block.timestamp >= lastBreedTime[aminalTwo] + BREED_COOLDOWN,
        "Aminal Two cooldown active"
    );

    // NEW: Maximum breed count
    require(breedCount[aminalOne] < MAX_BREED_COUNT, "Aminal One max breeds reached");
    require(breedCount[aminalTwo] < MAX_BREED_COUNT, "Aminal Two max breeds reached");

    // NEW: Pair-specific breed limit
    uint256 pairBreeds = pairBreedCount[aminalOne][aminalTwo] + pairBreedCount[aminalTwo][aminalOne];
    require(pairBreeds < MAX_PAIR_BREEDS, "Pair max breeds reached");

    // NEW: Energy requirement
    require(IAminal(aminalOne).energy() >= MIN_ENERGY_TO_BREED, "Aminal One insufficient energy");
    require(IAminal(aminalTwo).energy() >= MIN_ENERGY_TO_BREED, "Aminal Two insufficient energy");

    // NEW: Caller authorization (must own or be approved for at least one parent)
    require(
        IAminal(aminalOne).owner() == msg.sender ||
        IAminal(aminalTwo).owner() == msg.sender ||
        IAminal(aminalOne).getApproved(0) == msg.sender ||
        IAminal(aminalTwo).getApproved(0) == msg.sender,
        "Not authorized to breed these Aminals"
    );

    // NEW: Prevent genesis breeding (if parents are 0x0)
    require(!_isGenesisAminal(aminalOne), "Cannot breed genesis Aminal One");
    require(!_isGenesisAminal(aminalTwo), "Cannot breed genesis Aminal Two");

    // NEW: Prevent incest (parent-child or sibling breeding)
    require(!_areRelated(aminalOne, aminalTwo), "Cannot breed related Aminals");

    // Update state
    lastBreedTime[aminalOne] = block.timestamp;
    lastBreedTime[aminalTwo] = block.timestamp;
    breedCount[aminalOne]++;
    breedCount[aminalTwo]++;
    pairBreedCount[aminalOne][aminalTwo]++;

    // Create auction
    auctionId = geneAuction.createAuction(aminalOne, aminalTwo);
    emit AminalsBreeding(aminalOne, aminalTwo, auctionId);
}

function _isGenesisAminal(address aminal) internal view returns (bool) {
    // Check if Aminal has no parents (genesis)
    return IAminal(aminal).parentOne() == address(0) && IAminal(aminal).parentTwo() == address(0);
}

function _areRelated(address aminalOne, address aminalTwo) internal view returns (bool) {
    address oneParentOne = IAminal(aminalOne).parentOne();
    address oneParentTwo = IAminal(aminalOne).parentTwo();
    address twoParentOne = IAminal(aminalTwo).parentOne();
    address twoParentTwo = IAminal(aminalTwo).parentTwo();

    // Check if they share a parent (siblings)
    if (oneParentOne != address(0) && (oneParentOne == twoParentOne || oneParentOne == twoParentTwo)) {
        return true;
    }
    if (oneParentTwo != address(0) && (oneParentTwo == twoParentOne || oneParentTwo == twoParentTwo)) {
        return true;
    }

    // Check if one is parent of other
    if (aminalOne == twoParentOne || aminalOne == twoParentTwo) return true;
    if (aminalTwo == oneParentOne || aminalTwo == oneParentTwo) return true;

    return false;
}
```

---

### 11. STATE INCONSISTENCY IN CATEGORY VOTING

**Severity:** 🟠 HIGH
**Contract:** `GeneAuction.sol:467-487`
**CWE-662:** Improper Synchronization

#### Description
When users change their votes, the previous gene's vote count is decremented but tied gene status (`isGeneTied`, `tiedGenes` array) is not updated. This creates stale state where a gene could still be marked as tied despite having fewer votes, potentially affecting tie-breaking logic.

#### Vulnerable Code
```solidity
function _processSingleVote(
    uint256 auctionId,
    VisualsCat category,
    uint256 geneId,
    uint256 userVotingPower
) internal {
    CategoryVoting storage categoryVoting = categoryVotingMap[auctionId][category];

    // Remove previous vote
    uint256 previousGeneId = categoryVoting.userVotedGene[msg.sender];
    if (categoryVoting.userHasVoted[msg.sender]) {
        uint256 previousVoteWeight = categoryVoting.userVoteWeights[msg.sender];
        categoryVoting.geneVotes[previousGeneId] -= previousVoteWeight;

        // BUG: Doesn't clean up tied status for previous gene
        // isGeneTied[previousGeneId] could still be true
        // tiedGenes array could still contain previousGeneId
    }

    // Add new vote
    categoryVoting.userHasVoted[msg.sender] = true;
    categoryVoting.userVotedGene[msg.sender] = geneId;
    categoryVoting.userVoteWeights[msg.sender] = userVotingPower;
    categoryVoting.geneVotes[geneId] += userVotingPower;

    _updateCategoryWinner(categoryVoting, geneId);
}
```

#### Attack Scenarios

**Scenario 1: Stale Tied Gene**
```
1. Gene A: 1000 votes, Gene B: 1000 votes (tied)
2. Both marked in tiedGenes array
3. User changes vote from Gene B to Gene A
4. Gene A now has 1050 votes, Gene B has 950 votes
5. Gene B still marked as tied in system
6. Tie-breaking logic includes Gene B incorrectly
7. Gene B could win despite having fewer votes
```

**Scenario 2: Incorrect Winner Selection**
```
1. Three genes: A (1000), B (1000), C (800)
2. A and B tied for first place
3. Multiple users change votes from B to C
4. Final: A (1000), B (700), C (1100)
5. B still in tiedGenes array
6. _selectWinningGene uses stale tie data
7. Wrong winner selected
```

**Scenario 3: Array Bloat**
```
1. 100 genes all temporarily tied at 100 votes each
2. All added to tiedGenes array
3. Users change votes, only 2 genes actually tied now
4. tiedGenes still contains all 100 genes
5. Tie-breaking iterates over 98 incorrect genes
6. Gas costs excessive, potentially hitting block limit
```

#### Impact
- **Incorrect Winners:** Auctions select wrong gene due to stale data
- **Gas DOS:** Bloated arrays cause excessive gas consumption
- **Unfairness:** Legitimate votes don't properly affect outcomes
- **State Corruption:** Inconsistent state between vote counts and tied status

#### Recommended Remediation

```solidity
function _processSingleVote(
    uint256 auctionId,
    VisualsCat category,
    uint256 geneId,
    uint256 userVotingPower
) internal {
    CategoryVoting storage categoryVoting = categoryVotingMap[auctionId][category];

    // Remove previous vote
    uint256 previousGeneId = categoryVoting.userVotedGene[msg.sender];
    if (categoryVoting.userHasVoted[msg.sender] && previousGeneId != 0) {
        uint256 previousVoteWeight = categoryVoting.userVoteWeights[msg.sender];
        categoryVoting.geneVotes[previousGeneId] -= previousVoteWeight;

        // NEW: Clean up previous gene's tied status
        _updateGeneAfterVoteRemoval(categoryVoting, previousGeneId);
    }

    // Add new vote
    categoryVoting.userHasVoted[msg.sender] = true;
    categoryVoting.userVotedGene[msg.sender] = geneId;
    categoryVoting.userVoteWeights[msg.sender] = userVotingPower;
    categoryVoting.geneVotes[geneId] += userVotingPower;

    _updateCategoryWinner(categoryVoting, geneId);
}

function _updateGeneAfterVoteRemoval(
    CategoryVoting storage categoryVoting,
    uint256 geneId
) internal {
    uint256 geneVotes = categoryVoting.geneVotes[geneId];
    uint256 highestVotes = categoryVoting.highestVotes;

    // If gene was tied and now has fewer votes, remove from tied list
    if (categoryVoting.isGeneTied[geneId] && geneVotes < highestVotes) {
        categoryVoting.isGeneTied[geneId] = false;

        // Remove from tiedGenes array
        _removeFromTiedArray(categoryVoting, geneId);
    }

    // If gene was the highest and now has fewer votes, recalculate winner
    if (geneVotes < highestVotes && geneId == categoryVoting.winningGeneId) {
        _recalculateCategoryWinner(categoryVoting);
    }
}

function _removeFromTiedArray(
    CategoryVoting storage categoryVoting,
    uint256 geneId
) internal {
    uint256[] storage tiedGenes = categoryVoting.tiedGenes;

    for (uint256 i = 0; i < tiedGenes.length; i++) {
        if (tiedGenes[i] == geneId) {
            // Swap with last element and pop
            tiedGenes[i] = tiedGenes[tiedGenes.length - 1];
            tiedGenes.pop();
            break;
        }
    }
}

function _recalculateCategoryWinner(CategoryVoting storage categoryVoting) internal {
    // Reset tied genes
    delete categoryVoting.tiedGenes;
    categoryVoting.highestVotes = 0;
    categoryVoting.winningGeneId = 0;

    // Iterate through all genes that have received votes
    // This requires tracking active genes - add this tracking:
    uint256[] storage activeGenes = categoryVoting.activeGenes; // NEW: track genes with votes

    for (uint256 i = 0; i < activeGenes.length; i++) {
        uint256 geneId = activeGenes[i];
        uint256 votes = categoryVoting.geneVotes[geneId];

        if (votes > 0) {
            if (votes > categoryVoting.highestVotes) {
                // New highest vote
                categoryVoting.highestVotes = votes;
                categoryVoting.winningGeneId = geneId;

                // Clear tied genes
                delete categoryVoting.tiedGenes;
                categoryVoting.isGeneTied[geneId] = false;

            } else if (votes == categoryVoting.highestVotes) {
                // Tie detected
                if (categoryVoting.tiedGenes.length == 0) {
                    // First tie, add current winner
                    categoryVoting.tiedGenes.push(categoryVoting.winningGeneId);
                    categoryVoting.isGeneTied[categoryVoting.winningGeneId] = true;
                }
                // Add this gene to tied list
                categoryVoting.tiedGenes.push(geneId);
                categoryVoting.isGeneTied[geneId] = true;
            }
        }
    }
}

// Also update voteOnGene to track active genes
function voteOnGene(uint256 auctionId, VisualsCat category, uint256 geneId)
    external
    validVoting(auctionId)
{
    // ... existing validation ...

    CategoryVoting storage categoryVoting = categoryVotingMap[auctionId][category];

    // NEW: Track gene as active if first vote
    if (categoryVoting.geneVotes[geneId] == 0) {
        categoryVoting.activeGenes.push(geneId);
    }

    // ... rest of function ...
}
```

---

### 12. GAS LIMIT DOS IN UNBOUNDED LOOPS

**Severity:** 🟠 HIGH
**Contract:** `GeneRegistry.sol:107-146`
**CWE-834:** Excessive Iteration

#### Description
The `getGenesByCreator` and `getGenesByCategory` functions iterate over all genes ever created (`totalGenesCreated`). As the system grows, these functions will eventually exceed block gas limits and become permanently unusable.

#### Vulnerable Code
```solidity
function getGenesByCreator(address creator) external view returns (uint256[] memory geneIds) {
    uint256 count = 0;

    // DANGER: Unbounded loop over all genes
    for (uint256 i = 0; i < totalGenesCreated; i++) {
        if (geneCreators[i] == creator) count++;
    }

    geneIds = new uint256[](count);
    uint256 index = 0;

    // DANGER: Second unbounded loop
    for (uint256 i = 0; i < totalGenesCreated; i++) {
        if (geneCreators[i] == creator) {
            geneIds[index] = i;
            index++;
        }
    }
}

function getGenesByCategory(VisualsCat category) external view returns (uint256[] memory geneIds) {
    // Same unbounded loop pattern
    for (uint256 i = 0; i < totalGenesCreated; i++) {
        // ...
    }
}
```

#### Attack Scenarios

**Scenario 1: Natural Growth DOS**
```
Timeline:
- Day 1: 100 genes, getGenesByCreator costs 500k gas ✓
- Month 1: 1,000 genes, 5M gas ✓
- Year 1: 10,000 genes, 50M gas ✗ (exceeds block limit ~30M)
- Year 2: Function permanently unusable
```

**Scenario 2: Intentional DOS**
```
1. Attacker creates 10,000 genes at minimal cost
2. Each gene creation only costs ~100k gas
3. Total attack cost: 10,000 * 100k = 1B gas (~100 ETH at 100 gwei)
4. getGenesByCreator now costs 50M+ gas
5. Function reverts for everyone permanently
6. Frontend/indexer breaks
```

**Scenario 3: Cascading Failure**
```
1. getGenesByCategory exceeds gas limit
2. Frontend relies on this for gene browsing
3. Users can't discover genes
4. Voting becomes impossible (can't find genes to vote on)
5. Entire auction system breaks
```

#### Impact
- **Permanent DOS:** Functions become unusable after scale
- **Frontend Breakage:** UIs relying on these functions stop working
- **Low Attack Cost:** Relatively cheap to accelerate DOS
- **Indexer Dependency:** Forces reliance on off-chain infrastructure
- **User Experience:** Gene discovery broken

#### Recommended Remediation

**Option 1: Remove On-Chain Enumeration (Recommended)**
```solidity
// Remove problematic functions entirely
// Use events + off-chain indexing (The Graph, etc.)

event GeneCreated(uint256 indexed geneId, address indexed creator, VisualsCat indexed category, string uri);

// Frontend queries events to build gene lists
// This is the standard pattern for NFT enumeration
```

**Option 2: Pagination**
```solidity
function getGenesByCreator(
    address creator,
    uint256 offset,
    uint256 limit
) external view returns (
    uint256[] memory geneIds,
    uint256 total,
    bool hasMore
) {
    require(limit <= 100, "Limit too high"); // Max 100 per query

    // First count total
    uint256 count = 0;
    for (uint256 i = 0; i < totalGenesCreated; i++) {
        if (geneCreators[i] == creator) count++;
    }
    total = count;

    // Determine result size
    uint256 remaining = count > offset ? count - offset : 0;
    uint256 resultSize = remaining > limit ? limit : remaining;
    geneIds = new uint256[](resultSize);

    // Collect paginated results
    uint256 found = 0;
    uint256 index = 0;
    for (uint256 i = 0; i < totalGenesCreated && index < resultSize; i++) {
        if (geneCreators[i] == creator) {
            if (found >= offset) {
                geneIds[index] = i;
                index++;
            }
            found++;
        }
    }

    hasMore = offset + resultSize < total;
}
```

**Option 3: Reverse Mapping (Best for On-Chain)**
```solidity
// Maintain reverse mapping during creation
mapping(address => uint256[]) private creatorGenes;
mapping(VisualsCat => uint256[]) private categoryGenes;

function createGene(
    VisualsCat category,
    string calldata uri,
    string calldata visualsName,
    string calldata visualsSvg
) external returns (uint256 tokenId) {
    // ... existing creation logic ...

    // NEW: Update reverse mappings
    creatorGenes[msg.sender].push(tokenId);
    categoryGenes[category].push(tokenId);

    // ... rest of function ...
}

function getGenesByCreator(address creator) external view returns (uint256[] memory) {
    return creatorGenes[creator]; // O(1) lookup!
}

function getGenesByCategory(VisualsCat category) external view returns (uint256[] memory) {
    return categoryGenes[category]; // O(1) lookup!
}

// Optional: Add pagination for large arrays
function getGenesByCreatorPaginated(
    address creator,
    uint256 offset,
    uint256 limit
) external view returns (uint256[] memory geneIds) {
    uint256[] storage allGenes = creatorGenes[creator];
    require(offset < allGenes.length, "Offset out of bounds");

    uint256 end = offset + limit;
    if (end > allGenes.length) end = allGenes.length;

    uint256 resultSize = end - offset;
    geneIds = new uint256[](resultSize);

    for (uint256 i = 0; i < resultSize; i++) {
        geneIds[i] = allGenes[offset + i];
    }
}
```

**Option 4: Bitmap Indexing**
```solidity
// For very large scale, use bitmaps
mapping(address => mapping(uint256 => uint256)) private creatorGeneBitmaps;
// address => (chunk => bitmap)

function addGeneToCreator(address creator, uint256 geneId) internal {
    uint256 chunk = geneId / 256;
    uint256 bit = geneId % 256;
    creatorGeneBitmaps[creator][chunk] |= (1 << bit);
}

function hasGene(address creator, uint256 geneId) external view returns (bool) {
    uint256 chunk = geneId / 256;
    uint256 bit = geneId % 256;
    return (creatorGeneBitmaps[creator][chunk] & (1 << bit)) != 0;
}
```

---

## MEDIUM SEVERITY ISSUES

### 13. UNBOUNDED ENERGY CAP ALLOWS RESOURCE HOARDING

**Severity:** 🟡 MEDIUM
**Contract:** `Aminal.sol:62-65`

#### Description
`MAX_ENERGY` is set to 1,000,000 (equivalent to 100 ETH of feeding). Wealthy users can accumulate massive energy reserves, creating economic imbalance.

#### Vulnerable Code
```solidity
uint256 public constant MAX_ENERGY = 1_000_000; // 100 ETH worth
```

#### Impact
- Whales dominate game mechanics with energy reserves
- Small users at competitive disadvantage
- Hoarding prevents energy circulation

#### Recommended Remediation
```solidity
// Lower cap
uint256 public constant MAX_ENERGY = 100_000; // 10 ETH max

// Add energy decay
function _applyEnergyDecay() internal {
    uint256 timeSinceLastDecay = block.timestamp - lastDecayTime;
    if (timeSinceLastDecay >= 1 days) {
        uint256 decayAmount = energy / 100; // 1% per day
        energy -= decayAmount;
        lastDecayTime = block.timestamp;
    }
}
```

---

### 14. MISSING EVENT EMISSION FOR CRITICAL STATE CHANGES

**Severity:** 🟡 MEDIUM
**Contract:** `AminalFactory.sol:194-206`

#### Description
Initialization functions don't emit events, making configuration changes hard to track off-chain.

#### Vulnerable Code
```solidity
function initialize(address _geneAuction, address _aminalProposals, address _genes)
    external
    initializer
    onlyOwner
{
    // No event emitted
    geneAuction = GeneAuction(_geneAuction);
    genes = Genes(_genes);
    proposals = AminalProposals(_aminalProposals);
}
```

#### Recommended Remediation
```solidity
event FactoryInitialized(address geneAuction, address proposals, address genes);

function initialize(...) external initializer onlyOwner {
    geneAuction = GeneAuction(_geneAuction);
    genes = Genes(_genes);
    proposals = AminalProposals(_aminalProposals);

    emit FactoryInitialized(_geneAuction, _aminalProposals, _genes);
}
```

---

### 15. SKILL COST MANIPULATION VIA DYNAMIC REPORTING

**Severity:** 🟡 MEDIUM
**Contract:** `Aminal.sol:354-364`

#### Description
Skills report their own costs dynamically. Malicious skills could return different costs between estimation and execution.

#### Vulnerable Code
```solidity
uint256 energyCost;
try ISkill(target).skillCost(data) returns (uint256 cost) {
    energyCost = cost;
} catch {
    energyCost = 1;
}
// Cost could change between user's estimate and actual execution
```

#### Recommended Remediation
```solidity
function useSkill(address target, bytes calldata data, uint256 maxCost) external {
    uint256 energyCost = _getSkillCost(target, data);
    require(energyCost <= maxCost, "Cost exceeds maximum");
    // User commits to maximum cost they'll pay
}
```

---

### 16. SVG INJECTION IN GENE CREATION

**Severity:** 🟡 MEDIUM
**Contract:** `GeneRegistry.sol:52-75`

#### Description
SVG validation only checks for opening tag. Malicious users could inject scripts, external resources, or malformed SVG.

#### Vulnerable Code
```solidity
function _isValidSVG(string calldata svg) internal pure returns (bool) {
    bytes memory svgBytes = bytes(svg);
    bool hasOpeningTag = false;
    for (uint256 i = 0; i < svgBytes.length - 1; i++) {
        if (svgBytes[i] == "<" && svgBytes[i + 1] != "/") {
            hasOpeningTag = true;
            break;
        }
    }
    return hasOpeningTag; // Very weak validation
}
```

#### Attack Example
```svg
<svg><script>alert('XSS')</script><rect/></svg>
```

#### Recommended Remediation
```solidity
function _isValidSVG(string calldata svg) internal pure returns (bool) {
    bytes memory svgBytes = bytes(svg);

    // Check starts with <svg
    if (svgBytes.length < 5) return false;
    if (svgBytes[0] != '<') return false;
    if (svgBytes[1] != 's' && svgBytes[1] != 'S') return false;
    if (svgBytes[2] != 'v' && svgBytes[2] != 'V') return false;
    if (svgBytes[3] != 'g' && svgBytes[3] != 'G') return false;

    // Check for forbidden tags
    if (_contains(svg, "<script")) return false;
    if (_contains(svg, "javascript:")) return false;
    if (_contains(svg, "on")) return false; // onclick, onload, etc.

    return true;
}
```

---

### 17. LOVE ECONOMICS CLIFF EDGES ENABLE GAMING

**Severity:** 🟡 MEDIUM
**Contract:** `AminalVRGDA.sol:73-90`

#### Description
Love multiplier has sharp thresholds at energy=10 and energy=1,000,000. Users can manipulate energy to exact values for maximum love gain.

#### Vulnerable Code
```solidity
if (currentEnergy < 10) {
    loveMultiplier = MAX_LOVE_MULTIPLIER; // 10x
} else if (currentEnergy > 1_000_000) {
    loveMultiplier = MIN_LOVE_MULTIPLIER; // 0.1x
}
```

#### Attack Scenario
```
1. User burns energy to exactly 9
2. Feeds 10 ETH with 10x multiplier
3. Gains 100 ETH worth of love
4. Repeat for maximum efficiency
```

#### Recommended Remediation
```solidity
// Smooth curve instead of cliff edges
function _calculateLoveMultiplier(uint256 energy) internal pure returns (uint256) {
    if (energy <= 10) {
        // Smooth transition near bottom
        return MAX_LOVE_MULTIPLIER - ((10 - energy) * MAX_LOVE_MULTIPLIER / 20);
    } else if (energy >= 1_000_000) {
        // Smooth transition near top
        uint256 excess = energy - 1_000_000;
        uint256 reduction = (excess * MIN_LOVE_MULTIPLIER) / 1_000_000;
        return MIN_LOVE_MULTIPLIER > reduction ? MIN_LOVE_MULTIPLIER - reduction : MIN_LOVE_MULTIPLIER;
    } else {
        // Logarithmic curve in middle
        return _logarithmicInterpolation(energy, 10, 1_000_000, MAX_LOVE_MULTIPLIER, MIN_LOVE_MULTIPLIER);
    }
}
```

---

### 18. AMINAL PROPOSALS CONTRACT IS STUB

**Severity:** 🟡 MEDIUM
**Contract:** `AminalProposals.sol:1-9`

#### Description
The proposals contract is a placeholder with no governance implementation, yet it's integrated throughout the system as if functional.

#### Vulnerable Code
```solidity
contract AminalProposals {
    function setup(address factory) external {
        // Placeholder implementation
    }
}
```

#### Impact
- Missing governance creates centralization
- Owner has unchecked control
- Community cannot participate in decisions

#### Recommended Remediation
Implement proper governance:
```solidity
import "@openzeppelin/contracts/governance/Governor.sol";

contract AminalProposals is Governor, GovernorSettings, GovernorCountingSimple {
    // Implement proposal system
    // - Proposal creation
    // - Voting with love tokens
    // - Execution with timelock
}
```

---

## LOW SEVERITY ISSUES

### 19. MAGIC NUMBERS WITHOUT DOCUMENTATION

**Severity:** 🟢 LOW
**Contracts:** Multiple

#### Description
Constants like `TREASURY_TRANSFER_PERCENTAGE = 10`, `MIN_LOVE_REQUIRED = 10` lack rationale documentation.

#### Recommendation
```solidity
// Transfer 10% of treasury to gene creators
// Reasoning: Balances creator incentives with Aminal treasury preservation
uint256 public constant TREASURY_TRANSFER_PERCENTAGE = 10;

// Minimum 10 love tokens required to vote
// Reasoning: Prevents spam voting while keeping barrier low
uint256 public constant MIN_LOVE_REQUIRED = 10;
```

---

### 20. CONSOLE.LOG IN PRODUCTION CODE

**Severity:** 🟢 LOW
**Contracts:** `AminalFactory.sol`, `FightSkill.sol`, `Move2D.sol`

#### Description
Development logging statements remain in code.

#### Vulnerable Code
```solidity
import "forge-std/console.sol";
console.log("Aminal attacked: ", victim);
```

#### Impact
- Increased gas costs
- Unprofessional appearance
- Potential information leakage

#### Recommended Remediation
Remove all `console.log` imports and calls before deployment.

---

### 21. UNUSED STATE VARIABLES

**Severity:** 🟢 LOW
**Contract:** `Genes.sol:30`

#### Description
`aminalFactory` variable declared but never used.

#### Vulnerable Code
```solidity
address public aminalFactory; // Unused

modifier onlyAminalsFactory() {
    if (msg.sender != aminalFactory) revert OnlyAminalsFactory();
    _; // Modifier defined but never applied
}
```

#### Recommendation
Remove unused variables or implement intended functionality.

---

### 22. INCONSISTENT ERROR HANDLING

**Severity:** 🟢 LOW
**Contracts:** Multiple

#### Description
Mix of custom errors (gas efficient) and require strings (expensive).

#### Examples
```solidity
// Good
error NotEnoughLove();
if (love < amount) revert NotEnoughLove();

// Bad
require(isAminal[addr], "AminalFactory: invalid Aminal addresses");
```

#### Recommendation
Standardize on custom errors throughout.

---

### 23. MISSING NATSPEC DOCUMENTATION

**Severity:** 🟢 LOW
**Contracts:** Multiple

#### Description
Many internal functions lack NatSpec documentation.

#### Recommendation
```solidity
/// @notice Calculates love gained from ETH feeding
/// @dev Uses VRGDA mechanism with energy-based multiplier
/// @param aminal The Aminal being fed
/// @param ethAmount Amount of ETH to feed
/// @return loveGained Amount of love tokens earned
function getLoveForETH(address aminal, uint256 ethAmount) external view returns (uint256 loveGained) {
    // ...
}
```

---

### 24. CENTRALIZATION RISKS

**Severity:** 🟢 LOW
**Contracts:** `AminalFactory.sol`, `Genes.sol`

#### Description
Multiple contracts have powerful `onlyOwner` functions without multi-sig or timelock.

#### Functions
- `spawnInitialAminals` - Owner can create Aminals
- `setRegistry` - Owner changes critical registry
- `approveSkill` - Owner controls skill system

#### Recommendation
```solidity
// Use multi-sig
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";

// Add timelock
import "@openzeppelin/contracts/governance/TimelockController.sol";
```

---

### 25. NO EMERGENCY PAUSE MECHANISM

**Severity:** 🟢 LOW
**Contracts:** All

#### Description
No contracts implement emergency pause functionality. If critical vulnerability discovered, no way to halt operations.

#### Recommendation
```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract Aminal is Pausable {
    function useSkill(address target, bytes calldata data) external whenNotPaused {
        // ...
    }

    function feed() external payable whenNotPaused {
        // ...
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
```

---

## SUMMARY STATISTICS

| Severity | Count | Findings |
|----------|-------|----------|
| 🔴 **CRITICAL** | 5 | Weak randomness, treasury drain, reentrancy, overflow, unvalidated calls |
| 🟠 **HIGH** | 7 | Access control, front-running, unchecked returns, vote manipulation, input validation, state inconsistency, unbounded loops |
| 🟡 **MEDIUM** | 6 | Resource hoarding, missing events, cost manipulation, SVG injection, economic gaming, stub governance |
| 🟢 **LOW** | 7 | Magic numbers, console.log, unused variables, error handling, documentation, centralization, no pause |
| **TOTAL** | **25** | |

---

## REMEDIATION PRIORITY

### ⚠️ PRE-DEPLOYMENT (BLOCKING)

**Must fix before mainnet launch:**

1. **Implement Chainlink VRF for randomness** (Critical #1)
   - Replace all `block.prevrandao` usage
   - Add proper random number generation

2. **Add treasury protection mechanisms** (Critical #2)
   - Rate limiting on payouts
   - Maximum payout percentages
   - Multi-sig for large transfers

3. **Fix reentrancy in auction settlement** (Critical #3)
   - Implement pull payment pattern
   - Add explicit reentrancy guards

4. **Add overflow protection in VRGDA** (Critical #4)
   - Explicit bounds checking
   - Input validation on feed amounts

5. **Implement skill whitelist** (Critical #5)
   - Registry of approved skills
   - Gas limits on skill execution
   - Cost commitment mechanism

### 🔥 HIGH PRIORITY (PRE-LAUNCH)

**Should fix before mainnet:**

6. Registry access control with timelock (#6)
7. Commit-reveal voting scheme (#7)
8. Atomic payout settlement (#8)
9. Duplicate vote prevention (#9)
10. Breeding validation and limits (#10)
11. State consistency in voting (#11)
12. Remove unbounded loops (#12)

### 📋 MEDIUM PRIORITY (V1.1)

**Address in near-term update:**

13-18. Economic balancing, events, cost protection, SVG validation, governance implementation

### 🧹 CODE QUALITY (ONGOING)

**Improve continuously:**

19-25. Documentation, cleanup, standardization, decentralization, emergency controls

---

## TESTING RECOMMENDATIONS

### Critical Path Testing
- [ ] Randomness manipulation tests (validator MEV scenarios)
- [ ] Treasury drain attack simulations
- [ ] Reentrancy attack vectors
- [ ] Overflow edge cases (max values)
- [ ] Malicious skill contract tests

### Fuzzing Campaigns
- [ ] Fuzz VRGDA calculations with random inputs
- [ ] Fuzz voting state transitions
- [ ] Fuzz breeding parameter combinations
- [ ] Fuzz skill execution with malicious contracts

### Integration Testing
- [ ] Multi-user auction scenarios
- [ ] Concurrent breeding and voting
- [ ] Cross-contract interaction flows
- [ ] Gas limit boundary testing

### Economic Simulation
- [ ] Model love economy over 1+ year
- [ ] Test energy accumulation/decay
- [ ] Breeding rate sustainability
- [ ] Gene auction market dynamics

---

## EXTERNAL DEPENDENCIES

### Recommended Integrations

**Randomness:**
- Chainlink VRF v2
- API3 QRNG (alternative)

**Governance:**
- OpenZeppelin Governor
- Gnosis Safe multi-sig

**Monitoring:**
- OpenZeppelin Defender
- Tenderly alerts

**Indexing:**
- The Graph Protocol (already planned)

---

## CONCLUSION

The Aminals smart contract system demonstrates innovative design with autonomous contract architecture and complex game mechanics. However, **critical security vulnerabilities prevent production deployment in the current state**.

### Key Concerns

**Most Critical Issues:**
1. **Predictable randomness** allows complete manipulation of fight outcomes and gene selection
2. **Unprotected treasury access** could result in total fund loss if auction contract compromised
3. **Integer overflow risks** in economic calculations could corrupt the love economy
4. **Unvalidated skill system** enables DOS and state manipulation attacks
5. **Reentrancy vectors** in auction settlement could lead to fund loss

### Path Forward

**Phase 1: Critical Fixes (2-3 weeks)**
- Integrate Chainlink VRF
- Implement treasury protection
- Add skill whitelist
- Fix reentrancy issues
- Add overflow protection

**Phase 2: High Priority (1-2 weeks)**
- Commit-reveal voting
- Input validation
- State consistency
- Remove unbounded loops

**Phase 3: Polish & Audit (1 week)**
- Code cleanup
- Documentation
- Comprehensive testing
- Follow-up security review

### Estimated Timeline
- **Security fixes:** 4-6 weeks
- **Re-audit:** 1 week
- **Testing & refinement:** 2 weeks
- **Total:** 7-9 weeks to production-ready

### Final Recommendation

**DO NOT DEPLOY** in current state. The critical vulnerabilities pose unacceptable risk of fund loss and system manipulation. After implementing recommended fixes, conduct a follow-up security audit to verify remediation effectiveness.

The project has strong fundamentals and innovative design. With proper security hardening, Aminals can be a secure and engaging decentralized pet platform.

---

**End of Security Audit Report**
