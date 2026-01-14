import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
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

    const handleClear = useCallback(() => {
        setInternalValue('');
        onChange('');
    }, [onChange]);

    return (
        <div className={cn('relative', className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                type="text"
                value={internalValue}
                onChange={(e) => setInternalValue(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-9"
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
    );
}
