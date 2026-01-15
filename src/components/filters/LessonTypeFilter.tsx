import { Badge } from '@/components/ui/badge';
import { BookOpenText, Play, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LessonType = 'text' | 'video' | 'quiz';

interface LessonTypeFilterProps {
    selected: LessonType[];
    onChange: (selected: LessonType[]) => void;
    className?: string;
}

const LESSON_TYPES: { type: LessonType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'text', label: 'Text', icon: BookOpenText },
    { type: 'video', label: 'Video', icon: Play },
    { type: 'quiz', label: 'Quiz', icon: HelpCircle },
];

export function LessonTypeFilter({ selected, onChange, className }: LessonTypeFilterProps) {
    const handleToggle = (type: LessonType) => {
        if (selected.includes(type)) {
            onChange(selected.filter((t) => t !== type));
        } else {
            onChange([...selected, type]);
        }
    };

    const isAllSelected = selected.length === 0;

    const handleSelectAll = () => {
        onChange([]);
    };

    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            <button
                type="button"
                onClick={handleSelectAll}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
            >
                <Badge
                    variant={isAllSelected ? 'brand' : 'outline'}
                    size="md"
                    className="cursor-pointer transition-all hover:scale-105"
                >
                    All
                </Badge>
            </button>
            {LESSON_TYPES.map(({ type, label, icon: Icon }) => {
                const isSelected = selected.includes(type);
                return (
                    <button
                        key={type}
                        type="button"
                        onClick={() => handleToggle(type)}
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
                    >
                        <Badge
                            variant={isSelected ? 'brand' : 'outline'}
                            size="md"
                            icon={Icon}
                            iconPosition="left"
                            className="cursor-pointer transition-all hover:scale-105"
                        >
                            {label}
                        </Badge>
                    </button>
                );
            })}
        </div>
    );
}
