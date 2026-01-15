import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusFilterValue = 'all' | 'available' | 'coming_soon';

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
  className?: string;
  showLabels?: boolean;
}

const STATUS_OPTIONS: { value: StatusFilterValue; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'all', label: 'All', icon: List },
  { value: 'available', label: 'Available', icon: CheckCircle },
  { value: 'coming_soon', label: 'Coming Soon', icon: Clock },
];

export function StatusFilter({ value, onChange, className, showLabels = true }: StatusFilterProps) {
  const handleToggle = (optionValue: StatusFilterValue) => {
    if (value === optionValue) {
      // Se clicar no mesmo filtro, desmarca voltando para 'all'
      onChange('all');
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {STATUS_OPTIONS.map(({ value: optionValue, label, icon: Icon }) => {
        const isSelected = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => handleToggle(optionValue)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
          >
            <Badge
              variant={isSelected ? 'brand' : 'outline'}
              size="md"
              icon={Icon}
              iconPosition="left"
              className="cursor-pointer transition-all hover:scale-105 h-10 px-3 flex items-center"
            >
              {showLabels ? label : ''}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
