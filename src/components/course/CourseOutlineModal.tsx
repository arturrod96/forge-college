import { useIsMobile } from '@/hooks/use-mobile';
import { Course, Lesson } from '@/pages/CourseView';
import { CourseTableOfContents } from '@/components/dashboard/CourseTableOfContents';
import { X, Search } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CourseOutlineModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: Course;
    currentLessonId?: string;
    defaultOpenModuleId?: string;
    onLessonClick: (lesson: Lesson) => void;
}

export function CourseOutlineModal({
    open,
    onOpenChange,
    course,
    currentLessonId,
    defaultOpenModuleId,
    onLessonClick,
}: CourseOutlineModalProps) {
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState('');
    const [animationPhase, setAnimationPhase] = useState<'closed' | 'backdrop' | 'content'>('closed');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);

    // Flatten lessons for navigation
    const allLessons = useMemo(() => {
        return course.modules.flatMap((module, moduleIndex) =>
            module.lessons.map((lesson, lessonIndex) => ({
                ...lesson,
                moduleName: module.title,
                moduleId: module.id,
                globalIndex: moduleIndex * 100 + lessonIndex,
            }))
        );
    }, [course]);

    // Filter lessons by search query
    const filteredLessons = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const query = searchQuery.toLowerCase();
        return allLessons.filter(
            (lesson) =>
                lesson.title.toLowerCase().includes(query) ||
                lesson.moduleName.toLowerCase().includes(query)
        );
    }, [allLessons, searchQuery]);

    // Get navigable lessons (filtered or all)
    const navigableLessons = filteredLessons || allLessons;

    // Handle staged animation
    useEffect(() => {
        if (open) {
            // Phase 1: Show backdrop with blur (immediate)
            setAnimationPhase('backdrop');
            // Phase 2: Show content (after backdrop settles)
            const timer = setTimeout(() => {
                setAnimationPhase('content');
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setAnimationPhase('closed');
            setSelectedIndex(-1);
        }
    }, [open]);

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(searchQuery ? 0 : -1);
    }, [searchQuery]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && listContainerRef.current) {
            const selectedElement = listContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedIndex]);

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    onOpenChange(false);
                    setSearchQuery('');
                    break;

                case 'ArrowDown':
                case 'j':
                    if (e.key === 'j' && document.activeElement === searchInputRef.current) break;
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < navigableLessons.length - 1 ? prev + 1 : 0
                    );
                    break;

                case 'ArrowUp':
                case 'k':
                    if (e.key === 'k' && document.activeElement === searchInputRef.current) break;
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev > 0 ? prev - 1 : navigableLessons.length - 1
                    );
                    break;

                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && navigableLessons[selectedIndex]) {
                        handleLessonClick(navigableLessons[selectedIndex]);
                    }
                    break;

                case '/':
                    if (document.activeElement !== searchInputRef.current) {
                        e.preventDefault();
                        searchInputRef.current?.focus();
                    }
                    break;

                default:
                    // Cmd+K or Ctrl+K to focus search
                    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                        e.preventDefault();
                        searchInputRef.current?.focus();
                    }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onOpenChange, selectedIndex, navigableLessons]);

    const handleLessonClick = useCallback((lesson: Lesson) => {
        onLessonClick(lesson);
        onOpenChange(false);
        setSearchQuery('');
    }, [onLessonClick, onOpenChange]);

    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onOpenChange(false);
            setSearchQuery('');
        }
    }, [onOpenChange]);

    if (!open && animationPhase === 'closed') return null;

    const isBackdropVisible = animationPhase !== 'closed';
    const isContentVisible = animationPhase === 'content';

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-start justify-center",
                isMobile ? "pt-0" : "pt-[10vh]"
            )}
            onClick={handleBackdropClick}
        >
            {/* Backdrop - blur applied immediately, opacity animated */}
            <div
                className={cn(
                    "absolute inset-0 backdrop-blur-xl bg-black/40",
                    "transition-opacity duration-300 ease-out",
                    isBackdropVisible ? "opacity-100" : "opacity-0"
                )}
                style={{
                    // Force GPU acceleration for smoother blur
                    transform: 'translateZ(0)',
                    willChange: 'opacity',
                }}
            />

            {/* Modal Container */}
            <div
                className={cn(
                    "relative w-full",
                    "transition-all duration-300 ease-out",
                    isMobile
                        ? "h-full max-h-full"
                        : "max-w-lg mx-4 max-h-[75vh]",
                    isContentVisible
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-[0.98] -translate-y-2"
                )}
                style={{
                    transitionDelay: isContentVisible ? '50ms' : '0ms',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Glass Card */}
                <div
                    className={cn(
                        "flex flex-col overflow-hidden",
                        "bg-white/90 dark:bg-gray-900/90",
                        "backdrop-blur-2xl backdrop-saturate-150",
                        "border border-white/30 dark:border-gray-700/40",
                        "shadow-2xl shadow-black/25",
                        isMobile
                            ? "h-full rounded-none"
                            : "rounded-2xl"
                    )}
                >
                    {/* Header with Search */}
                    <div className="flex-shrink-0 p-4 border-b border-gray-200/60 dark:border-gray-700/60">
                        {/* Search Input - Spotlight style */}
                        <div className="relative flex items-center gap-3">
                            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar lição..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "w-full pl-10 pr-4 py-2.5 rounded-lg",
                                    "bg-gray-100/80 dark:bg-gray-800/80",
                                    "border border-gray-200/60 dark:border-gray-700/60",
                                    "text-gray-900 dark:text-gray-100 placeholder-gray-400",
                                    "focus:outline-none focus:ring-2 focus:ring-forge-orange/50 focus:border-forge-orange/30",
                                    "transition-all duration-200"
                                )}
                                autoFocus={!isMobile}
                            />
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    onOpenChange(false);
                                    setSearchQuery('');
                                }}
                                className={cn(
                                    "flex-shrink-0 p-2 rounded-lg",
                                    "hover:bg-gray-200/80 dark:hover:bg-gray-700/80",
                                    "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                                    "transition-colors duration-200"
                                )}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        ref={listContainerRef}
                        className={cn(
                            "flex-1 overflow-y-auto overscroll-contain",
                            isMobile ? "pb-safe" : ""
                        )}
                    >
                        {filteredLessons ? (
                            // Search Results with keyboard navigation
                            <div className="p-2">
                                {filteredLessons.length === 0 ? (
                                    <div className="py-8 text-center text-gray-500">
                                        <p className="text-sm">Nenhuma lição encontrada</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredLessons.map((lesson, index) => (
                                            <button
                                                key={lesson.id}
                                                data-index={index}
                                                onClick={() => handleLessonClick(lesson)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={cn(
                                                    "w-full flex flex-col items-start p-3 rounded-xl text-left",
                                                    "transition-all duration-150",
                                                    selectedIndex === index
                                                        ? "bg-forge-orange/15 ring-1 ring-forge-orange/30"
                                                        : "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                                                    currentLessonId === lesson.id &&
                                                    "border-l-2 border-forge-orange"
                                                )}
                                            >
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {lesson.title}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {lesson.moduleName}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Full Table of Contents
                            <CourseTableOfContents
                                course={course}
                                currentLessonId={currentLessonId}
                                defaultOpenModuleId={defaultOpenModuleId}
                                onLessonClick={handleLessonClick}
                            />
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
}
