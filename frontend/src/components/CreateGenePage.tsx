'use client';

import { TRAIT_CATEGORIES } from '@constants/trait-categories';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { geneRegistryAbi, geneRegistryAddress } from '../contracts/generated';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';

interface CreateGenePageProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (geneId?: string) => void;
  preSelectedCategory?: number;
}

interface ValidationError {
  line?: number;
  message: string;
  type: 'error' | 'warning';
}

type WizardStep = 'design' | 'review';

function CreateGenePage({
  isOpen,
  onClose,
  onSuccess,
  preSelectedCategory = 0,
}: CreateGenePageProps) {
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState<WizardStep>('design');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<number>(preSelectedCategory);
  const [svg, setSvg] = useState(
    '<circle cx="500" cy="500" r="200" fill="#ff6b6b"/>'
  );
  const [isCreating, setIsCreating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [previewBackground, setPreviewBackground] = useState<
    'white' | 'black' | 'checkerboard'
  >('checkerboard');
  const [showContextPreview, setShowContextPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Update category when prop changes
  useEffect(() => {
    setCategory(preSelectedCategory);
  }, [preSelectedCategory]);

  // Validate SVG in real-time
  useEffect(() => {
    validateSVG(svg);
  }, [svg]);

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && isCreating) {
      toast.success('🧬 Gene NFT created successfully!', {
        id: 'create-gene-tx',
        duration: 5000,
      });

      setIsCreating(false);
      // Reset form
      setName('');
      setDescription('');
      setCategory(preSelectedCategory);
      setSvg('<circle cx="500" cy="500" r="200" fill="#ff6b6b"/>');
      setCurrentStep('design');
      onSuccess?.();
      onClose();
    }
  }, [isConfirmed, isCreating, onSuccess, onClose, preSelectedCategory]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError);
      toast.error('Failed to create gene. Please try again.', {
        id: 'create-gene-tx',
      });
      setIsCreating(false);
    }
  }, [writeError]);

  useEffect(() => {
    if (receiptError) {
      console.error('Transaction receipt error:', receiptError);
      toast.error('Transaction failed. Please try again.', {
        id: 'create-gene-tx',
      });
      setIsCreating(false);
    }
  }, [receiptError]);

  // Handle pending transaction
  useEffect(() => {
    if (isPending) {
      toast.loading('Preparing transaction...', { id: 'create-gene-tx' });
    } else if (isConfirming && hash) {
      toast.loading('Transaction submitted, waiting for confirmation...', {
        id: 'create-gene-tx',
      });
    }
  }, [isPending, isConfirming, hash]);

  const validateSVG = (svgContent: string) => {
    const errors: ValidationError[] = [];

    // Check if empty
    if (!svgContent.trim()) {
      errors.push({
        message: 'SVG content is empty',
        type: 'error',
      });
      setValidationErrors(errors);
      return;
    }

    // Try to parse as XML
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(
        `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`,
        'image/svg+xml'
      );
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        errors.push({
          message: 'Invalid XML/SVG syntax',
          type: 'error',
        });
      }
    } catch (e) {
      errors.push({
        message: 'Failed to parse SVG',
        type: 'error',
      });
    }

    // Check for external references
    if (
      svgContent.includes('http://') ||
      svgContent.includes('https://') ||
      svgContent.includes('xlink:href')
    ) {
      errors.push({
        message: 'External references are not supported',
        type: 'error',
      });
    }

    // Check for scripts
    if (svgContent.includes('<script') || svgContent.includes('javascript:')) {
      errors.push({
        message: 'Scripts are not allowed',
        type: 'error',
      });
    }

    // Check size (warn if large)
    const byteSize = new Blob([svgContent]).size;
    if (byteSize > 50000) {
      errors.push({
        message: `SVG is too large (${(byteSize / 1024).toFixed(
          1
        )}KB). Maximum is 50KB.`,
        type: 'error',
      });
    } else if (byteSize > 10000) {
      errors.push({
        message: `SVG is large (${(byteSize / 1024).toFixed(
          1
        )}KB). Consider minifying to reduce gas costs.`,
        type: 'warning',
      });
    }

    setValidationErrors(errors);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg') && !file.name.endsWith('.xml')) {
      toast.error('Please select an SVG or XML file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Keep the entire SVG including the wrapper tag to preserve viewBox and other attributes
      const svgMatch = content.match(/<svg[\s\S]*<\/svg>/i);
      if (svgMatch) {
        setSvg(svgMatch[0].trim());
      } else {
        // Use the whole content if no svg wrapper found
        setSvg(content);
      }
      toast.success('SVG file imported successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleMinifySVG = async () => {
    try {
      let minified = svg;

      // Step 1: Remove XML comments
      minified = minified.replace(/<!--[\s\S]*?-->/g, '');

      // Step 2: Remove unnecessary whitespace between tags (but preserve text content)
      minified = minified.replace(/>\s+</g, '><');

      // Step 3: Remove leading/trailing whitespace inside tags
      minified = minified.replace(/\s+([>\/])/g, '$1');
      minified = minified.replace(/([<])\s+/g, '$1');

      // Step 4: Collapse multiple spaces in attribute values to single space
      minified = minified.replace(/\s{2,}/g, ' ');

      // Step 5: Remove spaces around = in attributes
      minified = minified.replace(/\s*=\s*/g, '=');

      // Step 6: Optimize number precision (reduce to 2 decimal places max)
      minified = minified.replace(/(\d+\.\d{3,})/g, (match) => {
        return parseFloat(match).toFixed(2);
      });

      // Step 7: Remove trailing zeros in decimals
      minified = minified.replace(/(\d+)\.(\d*?)0+(["\s,<>])/g, '$1.$2$3');
      minified = minified.replace(/(\d+)\.(["\s,<>])/g, '$1$2'); // Remove .0

      // Step 8: Remove default attribute values
      minified = minified.replace(/\s+fill="black"/gi, '');
      minified = minified.replace(/\s+stroke="none"/gi, '');
      minified = minified.replace(/\s+stroke-width="1"/gi, '');
      minified = minified.replace(/\s+opacity="1"/gi, '');
      minified = minified.replace(/\s+fill-opacity="1"/gi, '');
      minified = minified.replace(/\s+stroke-opacity="1"/gi, '');

      // Step 9: Trim the result
      minified = minified.trim();

      const originalSize = new Blob([svg]).size;
      const minifiedSize = new Blob([minified]).size;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

      if (minifiedSize >= originalSize) {
        toast.error(
          'Minification did not reduce size. SVG may already be optimized.'
        );
        return;
      }

      setSvg(minified);
      toast.success(
        `SVG minified! Reduced by ${savings}% (${originalSize}B → ${minifiedSize}B)`
      );
    } catch (error) {
      console.error('Minification error:', error);
      toast.error('Failed to minify SVG. The SVG may have syntax errors.');
    }
  };

  const handleNextStep = () => {
    const hasErrors = validationErrors.some((e) => e.type === 'error');
    if (hasErrors) {
      toast.error('Please fix validation errors before continuing');
      return;
    }
    if (!svg.trim()) {
      toast.error('Please create or paste an SVG design');
      return;
    }
    setCurrentStep('review');
  };

  const handleBackStep = () => {
    setCurrentStep('design');
  };

  const handleCreate = () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a name for your gene');
      return;
    }

    if (!svg.trim()) {
      toast.error('Please create or paste an SVG design');
      return;
    }

    const hasErrors = validationErrors.some((e) => e.type === 'error');
    if (hasErrors) {
      toast.error('Please fix validation errors before creating');
      return;
    }

    setIsCreating(true);

    writeContract({
      address: geneRegistryAddress,
      abi: geneRegistryAbi,
      functionName: 'createGene',
      args: [svg, category],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleClose = () => {
    setCurrentStep('design');
    onClose();
  };

  if (!isOpen) return null;

  const hasErrors = validationErrors.some((e) => e.type === 'error');
  const byteSize = new Blob([svg]).size;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-card rounded-lg w-full h-full md:w-[95vw] md:h-[95vh] md:max-w-[1600px] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Create Gene NFT</h2>
            <p className="text-muted-foreground text-sm">
              {currentStep === 'design'
                ? 'Step 1: Design your SVG trait'
                : 'Step 2: Review and submit'}
            </p>
          </div>
          <Button variant="outline" onClick={handleClose} size="sm">
            ✕ Close
          </Button>
        </div>

        {/* Step Progress Indicator */}
        <div className="px-6 pt-4 pb-2 border-b border-border shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => currentStep === 'review' && handleBackStep()}
              className={`flex items-center gap-2 ${
                currentStep === 'review'
                  ? 'cursor-pointer hover:opacity-80 transition-opacity'
                  : 'cursor-default'
              }`}
              disabled={currentStep === 'design'}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'design'
                    ? 'bg-energy text-energy-foreground'
                    : 'bg-success text-success-foreground'
                }`}
              >
                {currentStep === 'review' ? '✓' : '1'}
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === 'design'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                Design
              </span>
            </button>
            <div className="flex-1 h-px bg-border"></div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'review'
                    ? 'bg-energy text-energy-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  currentStep === 'review'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                Review & Submit
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentStep === 'design' ? (
          // STEP 1: DESIGN (50/50 Split)
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel - SVG Editor (50%) */}
            <div className="w-full md:w-1/2 flex flex-col border-r border-border overflow-hidden">
              <div className="flex-1 flex flex-col p-6 overflow-auto">
                {/* Editor Header */}
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-semibold">SVG Editor</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      📁 Import
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMinifySVG}
                      disabled={!svg.trim()}
                    >
                      ⚡ Minify
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,.xml"
                  onChange={handleFileImport}
                  className="hidden"
                />

                {/* SVG Code Editor */}
                <div className="flex-1 flex flex-col min-h-0">
                  <textarea
                    value={svg}
                    onChange={(e) => setSvg(e.target.value)}
                    className="flex-1 w-full p-4 font-mono text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-energy"
                    placeholder="Paste or type your SVG content here...
Note: SVG wrapper tags are not required"
                    spellCheck={false}
                  />
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {validationErrors.map((error, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${
                          error.type === 'error'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        <span className="font-semibold">
                          {error.type === 'error'
                            ? '❌ Error: '
                            : '⚠️  Warning: '}
                        </span>
                        {error.message}
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                  <div>
                    Size: <span className="font-medium">{byteSize} bytes</span>
                  </div>
                  <div>
                    Status:{' '}
                    <span
                      className={`font-medium ${
                        hasErrors ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {hasErrors ? 'Invalid' : 'Valid'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview (50%) */}
            <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
              <div className="flex-1 flex flex-col p-6 overflow-auto">
                {/* Preview Header */}
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-semibold">Live Preview</Label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowContextPreview(!showContextPreview)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        showContextPreview
                          ? 'bg-energy text-energy-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {showContextPreview ? '🐾 On Aminal' : '🎨 Isolated'}
                    </button>
                  </div>
                </div>

                {/* Background Selector */}
                <div className="flex gap-2 mb-6">
                  {(['white', 'black', 'checkerboard'] as const).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setPreviewBackground(bg)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        previewBackground === bg
                          ? 'bg-energy text-energy-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {bg.charAt(0).toUpperCase() + bg.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Preview Area */}
                <div className="flex-1 flex items-center justify-center min-h-0">
                  <div
                    className={`rounded-lg border border-border w-full max-w-sm aspect-square ${
                      previewBackground === 'white'
                        ? 'bg-white'
                        : previewBackground === 'black'
                        ? 'bg-black'
                        : 'bg-checkerboard'
                    }`}
                  >
                    {showContextPreview ? (
                      // Context preview with sample Aminal body
                      <svg viewBox="0 0 1000 1000" className="w-full h-full">
                        {/* Simple Aminal body placeholder */}
                        <circle cx="500" cy="500" r="300" fill="#e0e0e0" />
                        <circle cx="400" cy="450" r="50" fill="#333" />
                        <circle cx="600" cy="450" r="50" fill="#333" />
                        {/* Render the user's trait */}
                        <g dangerouslySetInnerHTML={{ __html: svg }} />
                      </svg>
                    ) : (
                      // Isolated preview
                      <svg
                        viewBox="0 0 1000 1000"
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                    )}
                  </div>
                </div>

                {/* Preview Info */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {(byteSize / 1024).toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">KB</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      ~{Math.ceil(byteSize / 100)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Gas (gwei)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // STEP 2: REVIEW & SUBMIT (50/50 Split)
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel - Preview */}
            <div className="w-full md:w-1/2 flex flex-col border-r border-border overflow-hidden">
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* Preview */}
                <div className="w-full max-w-lg space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="rounded-lg border-2 border-border w-full aspect-square bg-white">
                      {showContextPreview ? (
                        <svg viewBox="0 0 1000 1000" className="w-full h-full">
                          <circle cx="500" cy="500" r="300" fill="#e0e0e0" />
                          <circle cx="400" cy="450" r="50" fill="#333" />
                          <circle cx="600" cy="450" r="50" fill="#333" />
                          <g dangerouslySetInnerHTML={{ __html: svg }} />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 1000 1000"
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ __html: svg }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Preview Toggle */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setShowContextPreview(!showContextPreview)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        showContextPreview
                          ? 'bg-energy text-energy-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {showContextPreview ? '🐾 On Aminal' : '🎨 Isolated'}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-2xl font-bold">
                        {(byteSize / 1024).toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">KB</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="text-2xl font-bold">
                        ~{Math.ceil(byteSize / 100)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Gas (gwei)
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div
                        className={`text-2xl font-bold ${
                          hasErrors ? 'text-red-500' : 'text-green-500'
                        }`}
                      >
                        {hasErrors ? '✗' : '✓'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Status
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Metadata Form */}
            <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
              <div className="flex-1 flex flex-col p-6 overflow-auto">
                <Label className="text-lg font-semibold mb-6">
                  Gene Details
                </Label>

                <div className="space-y-6">
                  {/* Gene Name */}
                  <div>
                    <Label
                      htmlFor="gene-name"
                      className="text-sm font-medium mb-2 block"
                    >
                      Gene Name *
                    </Label>
                    <Input
                      id="gene-name"
                      type="text"
                      placeholder="e.g., Rainbow Wings"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {name.length}/50 characters
                    </div>
                  </div>

                  {/* Trait Category */}
                  <div>
                    <Label
                      htmlFor="gene-category"
                      className="text-sm font-medium mb-2 block"
                    >
                      Trait Category *
                    </Label>
                    <select
                      id="gene-category"
                      value={category}
                      onChange={(e) => setCategory(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                    >
                      {Object.entries(TRAIT_CATEGORIES).map(
                        ([key, { name, emoji }]) => (
                          <option key={key} value={key}>
                            {emoji} {name}
                          </option>
                        )
                      )}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose which part of the Aminal this gene affects
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <Label
                      htmlFor="gene-description"
                      className="text-sm font-medium mb-2 block"
                    >
                      Description (Optional)
                    </Label>
                    <textarea
                      id="gene-description"
                      placeholder="Describe this gene trait..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none h-24 bg-background"
                      maxLength={100}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {description.length}/100 characters
                    </div>
                  </div>

                  {!address && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">
                        Please connect your wallet to create a gene
                      </p>
                    </div>
                  )}

                  {hash && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Panel - Navigation/Actions */}
        <div className="border-t border-border p-6 shrink-0 bg-muted/30">
          {currentStep === 'design' ? (
            // Step 1 Footer
            <div className="flex items-center justify-end">
              <Button
                onClick={handleNextStep}
                disabled={!svg.trim() || hasErrors}
                variant="energy"
                size="lg"
              >
                Next: Review & Submit →
              </Button>
            </div>
          ) : (
            // Step 2 Footer
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBackStep}
                disabled={isPending || isConfirming}
              >
                ← Back to Edit
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  !address ||
                  !svg.trim() ||
                  !name.trim() ||
                  hasErrors ||
                  isPending ||
                  isConfirming
                }
                variant="energy"
                size="lg"
              >
                {isPending || isConfirming ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {isPending ? 'Creating...' : 'Confirming...'}
                  </>
                ) : (
                  '🧬 Create Gene NFT'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateGenePage;
