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

function CreateGenePage({
  isOpen,
  onClose,
  onSuccess,
  preSelectedCategory = 0,
}: CreateGenePageProps) {
  const { address } = useAccount();
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
  const [previewSize, setPreviewSize] = useState<'small' | 'medium' | 'large'>(
    'medium'
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
        message: `SVG is too large (${(byteSize / 1024).toFixed(1)}KB). Maximum is 50KB.`,
        type: 'error',
      });
    } else if (byteSize > 10000) {
      errors.push({
        message: `SVG is large (${(byteSize / 1024).toFixed(1)}KB). Consider minifying to reduce gas costs.`,
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
      // Try to extract just the SVG content without wrapper tags
      const svgMatch = content.match(
        /<svg[^>]*>([\s\S]*?)<\/svg>/i
      );
      if (svgMatch) {
        // Extract content between svg tags
        setSvg(svgMatch[1].trim());
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
    // For now, do basic minification without SVGO
    // Remove comments, extra whitespace, and newlines
    let minified = svg
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove space between tags
      .trim();

    const originalSize = new Blob([svg]).size;
    const minifiedSize = new Blob([minified]).size;
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

    setSvg(minified);
    toast.success(
      `SVG minified! Reduced by ${savings}% (${originalSize}B → ${minifiedSize}B)`
    );
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

  if (!isOpen) return null;

  const hasErrors = validationErrors.some((e) => e.type === 'error');
  const byteSize = new Blob([svg]).size;

  // Preview size dimensions
  const previewDimensions = {
    small: 96,
    medium: 200,
    large: 400,
  };

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
              Design a unique trait for Aminals
            </p>
          </div>
          <Button variant="outline" onClick={onClose} size="sm">
            ✕ Close
          </Button>
        </div>

        {/* Main Content - 50/50 Split */}
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
                    📁 Import SVG
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
                        {error.type === 'error' ? '❌ Error: ' : '⚠️  Warning: '}
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
                    className={`font-medium ${hasErrors ? 'text-red-500' : 'text-green-500'}`}
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

              {/* Preview Size Selector */}
              <div className="flex gap-2 mb-4">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setPreviewSize(size)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      previewSize === size
                        ? 'bg-energy text-energy-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
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
              <div className="flex-1 flex items-center justify-center">
                <div
                  className={`rounded-lg border border-border ${
                    previewBackground === 'white'
                      ? 'bg-white'
                      : previewBackground === 'black'
                        ? 'bg-black'
                        : 'bg-checkerboard'
                  }`}
                  style={{
                    width: previewDimensions[previewSize],
                    height: previewDimensions[previewSize],
                    backgroundImage:
                      previewBackground === 'checkerboard'
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : undefined,
                    backgroundSize:
                      previewBackground === 'checkerboard'
                        ? '20px 20px'
                        : undefined,
                    backgroundPosition:
                      previewBackground === 'checkerboard'
                        ? '0 0, 0 10px, 10px -10px, -10px 0px'
                        : undefined,
                  }}
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
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">
                      {(byteSize / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Gas:
                    </span>
                    <span className="font-medium">
                      ~{Math.ceil(byteSize / 100)} gwei
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={`font-medium ${hasErrors ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {hasErrors ? '❌ Invalid' : '✅ Valid'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel - Gene Details & Actions */}
        <div className="border-t border-border p-6 shrink-0 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Gene Name */}
              <div>
                <Label htmlFor="gene-name" className="text-sm font-medium mb-1">
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
                  className="text-sm font-medium mb-1"
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
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="gene-description"
                  className="text-sm font-medium mb-1"
                >
                  Description (Optional)
                </Label>
                <Input
                  id="gene-description"
                  type="text"
                  placeholder="Describe this gene..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={100}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {description.length}/100 characters
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {hash && (
                  <span>
                    Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} disabled={isPending || isConfirming}>
                  Cancel
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
            </div>

            {!address && (
              <p className="text-sm text-destructive mt-2 text-center">
                Please connect your wallet to create a gene
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGenePage;
