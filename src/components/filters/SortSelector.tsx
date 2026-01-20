import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Calendar, Type, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortOption = 
  | 'recent'
  | 'alphabetical'
  | 'path_order'
  | 'course_order'
  | 'module_order';

interface SortSelectorProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
  options?: SortOption[];
  showLabel?: boolean;
}

const SORT_OPTIONS: Record<SortOption, { icon: React.ComponentType<{ className?: string }> }> = {
  recent: { icon: Calendar },
  alphabetical: { icon: Type },
  path_order: { icon: ListOrdered },
  course_order: { icon: ListOrdered },
  module_order: { icon: ListOrdered },
};

export function SortSelector({ 
  value, 
  onChange, 
  className,
  options = ['recent', 'alphabetical', 'path_order'],
  showLabel = true
}: SortSelectorProps) {
  const { t } = useTranslation();

  const availableOptions = options.map(opt => ({
    value: opt,
    label: t(`filters.sortOptions.${opt}`),
    icon: SORT_OPTIONS[opt].icon,
  }));

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
      {showLabel && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">{t('filters.sortBy')}</span>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableOptions.map(({ value: optionValue, label, icon: Icon }) => (
            <SelectItem key={optionValue} value={optionValue}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
