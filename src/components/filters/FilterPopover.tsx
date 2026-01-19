import { useState, useMemo } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { StatusFilter, type StatusFilterValue } from './StatusFilter';
import { ProgressFilter, type ProgressFilterValue } from './ProgressFilter';
import { SortSelector, type SortOption } from './SortSelector';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterPopoverProps {
    // Status filter
    statusValue: StatusFilterValue;
    onStatusChange: (value: StatusFilterValue) => void;

    // Progress filter
    progressSelected: ProgressFilterValue[];
    onProgressChange: (selected: ProgressFilterValue[]) => void;

    // Sort
    sortValue: SortOption;
    onSortChange: (value: SortOption) => void;
    sortOptions?: SortOption[];

    className?: string;
}

export function FilterPopover({
    statusValue,
    onStatusChange,
    progressSelected,
    onProgressChange,
    sortValue,
    onSortChange,
    sortOptions = ['recent', 'alphabetical', 'path_order'],
    className,
}: FilterPopoverProps) {
    const [open, setOpen] = useState(false);

    // Count active filters (sort is not counted as a filter, it's just an ordering option)
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (statusValue !== 'all') count++;
        count += progressSelected.length;
        return count;
    }, [statusValue, progressSelected]);

    const handleClearAll = () => {
        onStatusChange('all');
        onProgressChange([]);
        // Note: We don't reset sort as it's not considered a filter
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-10 gap-2 px-3",
                        activeFilterCount > 0 && "border-forge-orange/50 bg-forge-orange/5",
                        className
                    )}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-forge-orange text-[10px] font-medium text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-4"
                align="start"
                sideOffset={8}
            >
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Filters</h4>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearAll}
                                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <X className="mr-1 h-3 w-3" />
                                Clear all
                            </Button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Status
                        </label>
                        <StatusFilter
                            value={statusValue}
                            onChange={onStatusChange}
                            showLabels={true}
                        />
                    </div>

                    {/* Progress Filter */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Progress
                        </label>
                        <ProgressFilter
                            selected={progressSelected}
                            onChange={onProgressChange}
                            showLabels={true}
                        />
                    </div>

                    {/* Sort */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Sort
                        </label>
                        <SortSelector
                            value={sortValue}
                            onChange={onSortChange}
                            options={sortOptions}
                            showLabel={false}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
