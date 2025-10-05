# Frontend Theme Makeover Progress

## Goal
Refactor all frontend components to use centralized OKLCH-based theme system. Remove hardcoded colors and gradients, use semantic color variants (love, energy, success, warning), and make design experimentation easy by centralizing all color decisions in `styles/globals.css`.

## Summary
- **Completed**: 26 files (Core theme + 18 components + 5 pages)
- **Remaining**: 5 pages (~62 color occurrences)
- **Colors removed**: ~540+ hardcoded color classes replaced with theme variables
- **Gradients removed**: All gradients eliminated from refactored components and pages

## Core Theme System ✅

### Completed
- ✅ **`styles/globals.css`** - Centralized OKLCH color definitions with semantic colors (love, energy, success, warning)
- ✅ **`tailwind.config.js`** - Updated to reference CSS variables for all colors
- ✅ **`src/components/ui/button.tsx`** - Added 9 semantic variants (default, love, energy, success, warning, feed, breed, skill, ghost, outline)
- ✅ **`src/components/ui/badge.tsx`** - Added semantic variants with 20% opacity backgrounds

## Components Refactored ✅

### Cards
- ✅ **`src/components/AminalCard.tsx`** - Removed gradients, uses theme colors, semantic badges
- ✅ **`src/components/GeneCard.tsx`** - Removed gradients, simplified to theme colors
- ✅ **`src/components/AuctionCard.tsx`** - Removed all gradients, uses semantic colors and Button variants

### Action Buttons
- ✅ **`src/components/actions/FeedButton.tsx`** - Uses Button variant="feed"
- ✅ **`src/components/actions/CallSkillButton.tsx`** - Uses Button variant="skill", removed gradients
- ✅ **`src/components/actions/BreedButton.tsx`** - Uses Button variant="breed"
- ✅ **`src/components/actions/VoteButton.tsx`** - Uses Button variant="love"
- ✅ **`src/components/actions/EndAuctionButton.tsx`** - Uses Button variant="energy"
- ✅ **`src/components/actions/ProposeButton.tsx`** - Uses Button variant="energy", semantic validation colors
- ✅ **`src/components/actions/BulkVoteButton.tsx`** - Uses Button variant="energy"

### Modals
- ✅ **`src/components/BreedingModal.tsx`** - Removed hardcoded colors, uses Button variant="breed", love theme for selection
- ✅ **`src/components/CreateGeneModal.tsx`** - Uses theme colors throughout, Button variant="energy"
- ✅ **`src/components/ProposeGeneModal.tsx`** - Uses theme colors, energy theme for selection, Button variant="energy"

### Other Components
- ✅ **`src/components/TraitSelector.tsx`** - Uses theme colors, energy for parents, love for community genes
- ✅ **`src/components/TraitCard.tsx`** - Uses card/secondary backgrounds, energy badge
- ✅ **`src/components/VoteStats.tsx`** - Removed all gradients, uses semantic stats colors (energy/success/warning/love)

### Pages Completed ✅
- ✅ **`pages/aminals/[id].tsx`** - Main detail page refactored with theme colors
- ✅ **`pages/breeding/index.tsx`** - Removed all gradients, uses semantic colors for stats/buttons
- ✅ **`pages/profile/[address].tsx`** - User profile refactored (58 color occurrences replaced)
- ✅ **`pages/breeding/[auctionId].tsx`** - Breeding detail with voting refactored (55 color occurrences replaced)
- ✅ **`pages/aminals/[id]/chat/[chatId].tsx`** - Chat session page refactored (25 color occurrences replaced)

## Pages Remaining 🚧

Based on grep analysis, these pages still have hardcoded colors:
- ⏳ `pages/aminals/[id]/chat/index.tsx` - **19 occurrences** (chat list)
- ⏳ `pages/genes/index.tsx` - **18 occurrences** (genes list)
- ⏳ `pages/leaderboard/index.tsx` - **3 occurrences** (leaderboard)
- ⏳ `pages/about.tsx` - **2 occurrences** (about page)
- ⏳ `pages/genes/[id].tsx` - **1 occurrence** (gene detail)

**Estimated remaining work**: ~43 color replacements across 5 pages

## Refactoring Patterns

### Color Replacements
Follow these systematic replacements for remaining pages:

**Backgrounds:**
- `bg-white` → `bg-card`
- `bg-gray-50` / `bg-gray-100` → `bg-muted`
- `bg-gray-200` → `bg-secondary`

**Text:**
- `text-gray-600` → `text-muted-foreground`
- `text-gray-700` / `text-gray-800` / `text-gray-900` → `text-foreground`

**Borders:**
- `border-gray-200` / `border-gray-300` → `border-border`

**Semantic Colors:**
- Green colors → `success` (e.g., `text-green-600` → `text-success`)
- Pink colors → `love` (e.g., `text-pink-600` → `text-love`)
- Purple colors → `energy` (e.g., `text-purple-600` → `text-energy`)
- Yellow/orange → `warning` (e.g., `text-yellow-600` → `text-warning`)
- Red colors → `destructive` (e.g., `text-red-600` → `text-destructive`)

**Gradients (REMOVE ALL):**
- `bg-gradient-to-r from-pink-500 to-purple-600` → `text-love` (for text)
- `bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200` → `bg-success/10 border border-success/30`
- Any gradient background → Solid semantic color with 10% opacity + 30% opacity border

**Buttons:**
- Remove custom color classes from `className`
- Use `variant` prop: `variant="love"`, `variant="energy"`, `variant="success"`, etc.

### Component Usage
- **Button variants**: default, love, energy, success, warning, feed, breed, skill, ghost, outline
- **Badge variants**: default, secondary, destructive, outline, love, energy, success, warning
- Use semantic variants to maintain consistency across the app

## Notes
- **Goal**: One file (`styles/globals.css`) controls all colors - easy design experimentation
- **Semantic colors**: love (pink), energy (purple), success (green), warning (yellow)
- **No gradients**: Replaced with solid colors + opacity for consistency
- **Theme variables**: All colors use CSS variables mapped in tailwind.config.js
- **OKLCH color space**: Perceptually uniform colors for better visual consistency
