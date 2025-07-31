'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';

interface SimpleSVGBuilderProps {
  onSVGChange: (svg: string) => void;
  initialSVG?: string;
}

export function SimpleSVGBuilder({
  onSVGChange,
  initialSVG = '',
}: SimpleSVGBuilderProps) {
  const [svgCode, setSvgCode] = useState(
    initialSVG ||
      '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="100" cy="100" r="50" fill="#ff6b6b"/>\n</svg>'
  );

  useEffect(() => {
    onSVGChange(svgCode);
  }, [svgCode, onSVGChange]);

  const handleSVGChange = (newSvg: string) => {
    setSvgCode(newSvg);
  };

  const loadExample = (example: string) => {
    setSvgCode(example);
  };

  return (
    <div className="space-y-4">
      {/* SVG Code Editor */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-2 block">SVG Code</Label>
        <textarea
          className="w-full h-48 text-sm font-mono p-3 border border-gray-200 rounded-md resize-none"
          value={svgCode}
          onChange={(e) => handleSVGChange(e.target.value)}
          placeholder="Paste your SVG code here..."
        />
      </Card>

      {/* Preview */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-2 block">Preview</Label>
        <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-white p-8 min-h-[200px]">
          <div
            className="w-32 h-32"
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
        </div>
      </Card>
    </div>
  );
}
