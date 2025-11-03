import * as React from 'react';
import { cn } from '@lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function Tooltip({ content, side = 'top', className }: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="group relative inline-flex items-center">
      <button
        type="button"
        className="ml-1 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More information"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 16v-4m0-4h.01"
          />
        </svg>
      </button>
      <div
        className={cn(
          'pointer-events-none absolute z-50 w-64 rounded-md bg-primary px-3 py-2 text-xs leading-relaxed text-primary-foreground shadow-lg transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0',
          side === 'top' && 'bottom-full left-1/2 mb-2 -translate-x-1/2',
          side === 'bottom' && 'top-full left-1/2 mt-2 -translate-x-1/2',
          side === 'left' && 'right-full top-1/2 mr-2 -translate-y-1/2',
          side === 'right' && 'left-full top-1/2 ml-2 -translate-y-1/2',
          className
        )}
      >
        {content}
      </div>
    </div>
  );
}
