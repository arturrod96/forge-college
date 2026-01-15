import { Badge } from '@/components/ui/badge';
import { Circle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProgressFilterValue = 'not_started' | 'in_progress' | 'completed';

interface ProgressFilterProps {
  selected: ProgressFilterValue[];
  onChange: (selected: ProgressFilterValue[]) => void;
  className?: string;
  showLabels?: boolean;
}

const PROGRESS_OPTIONS: { value: ProgressFilterValue; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'not_started', label: 'Not Started', icon: Circle },
  { value: 'in_progress', label: 'Started', icon: PlayCircle },
  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export function ProgressFilter({ selected, onChange, className, showLabels = true }: ProgressFilterProps) {
  const handleToggle = (value: ProgressFilterValue) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {PROGRESS_OPTIONS.map(({ value: optionValue, label, icon: Icon }) => {
        const isSelected = selected.includes(optionValue);
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
