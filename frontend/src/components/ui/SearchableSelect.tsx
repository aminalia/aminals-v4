'use client';

import { cn } from '@lib/utils';
import { ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
  count?: number;
}

interface AllOption {
  value: string;
  label: string;
  emoji?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allOption?: AllOption;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  allOption,
  className,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  // Get the currently selected option for display
  const selectedOption: SelectOption | AllOption | undefined = value === allOption?.value
    ? allOption
    : options.find((opt) => opt.value.toLowerCase() === value.toLowerCase());

  // Get count from selected option (only available for regular options, not allOption)
  const selectedCount = selectedOption && 'count' in selectedOption ? selectedOption.count : undefined;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2',
          'bg-card border border-border rounded-lg',
          'text-sm font-medium text-foreground',
          'hover:bg-muted transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring',
          isOpen && 'ring-2 ring-ring'
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.emoji && <span>{selectedOption.emoji}</span>}
          <span>{selectedOption?.label || placeholder}</span>
          {selectedCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              ({selectedCount})
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-1',
            'bg-card border border-border rounded-lg shadow-lg',
            'max-h-[300px] flex flex-col',
            'animate-in fade-in-0 zoom-in-95'
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  'w-full pl-8 pr-8 py-2',
                  'bg-background border border-border rounded-md',
                  'text-sm placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring'
                )}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 p-1">
            {/* All Option */}
            {allOption && !search && (
              <button
                type="button"
                onClick={() => handleSelect(allOption.value)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm',
                  'hover:bg-muted transition-colors text-left',
                  value === allOption.value && 'bg-primary/10 text-primary font-medium'
                )}
              >
                {allOption.emoji && <span>{allOption.emoji}</span>}
                <span>{allOption.label}</span>
              </button>
            )}

            {/* Filtered Options */}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No categories found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm',
                    'hover:bg-muted transition-colors text-left',
                    value.toLowerCase() === option.value.toLowerCase() &&
                      'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {option.emoji && <span>{option.emoji}</span>}
                    <span>{option.label}</span>
                  </span>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {option.count}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
