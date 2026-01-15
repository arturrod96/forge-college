import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ContentSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    debounceMs?: number;
}

export function ContentSearch({
    value,
    onChange,
    placeholder = 'Search...',
    className,
    debounceMs = 300,
}: ContentSearchProps) {
    const [internalValue, setInternalValue] = useState(value);
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync internal value with external value
    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    // Debounced onChange
    useEffect(() => {
        const timer = setTimeout(() => {
            if (internalValue !== value) {
                onChange(internalValue);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [internalValue, debounceMs, onChange, value]);

    // Auto-expand if there's a value
    useEffect(() => {
        if (value && !isExpanded) {
            setIsExpanded(true);
        }
    }, [value, isExpanded]);

    // Focus input when expanded
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                !internalValue
            ) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isExpanded, internalValue]);

    const handleClear = useCallback(() => {
        setInternalValue('');
        onChange('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [onChange]);

    const handleIconClick = () => {
        setIsExpanded(true);
    };

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            {!isExpanded ? (
                <button
                    type="button"
                    onClick={handleIconClick}
                    className="flex items-center justify-center h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
                    aria-label="Search"
                >
                    <Search className="h-4 w-4 text-muted-foreground" />
                </button>
            ) : (
                <div className="relative w-full min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        ref={inputRef}
                        type="text"
                        value={internalValue}
                        onChange={(e) => setInternalValue(e.target.value)}
                        placeholder={placeholder}
                        className="h-10 pl-9 pr-9"
                        onBlur={() => {
                            // Only collapse if there's no value
                            if (!internalValue) {
                                setIsExpanded(false);
                            }
                        }}
                    />
                    {internalValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
