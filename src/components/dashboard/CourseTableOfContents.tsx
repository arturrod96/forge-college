import { Course, Module, Lesson } from '@/pages/CourseView';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useOAuth';
import { useEffect, useState } from 'react';
import { createClientBrowser } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Props {
  course: Course;
  currentLessonId?: string;
  defaultOpenModuleId?: string;
  onLessonClick: (lesson: Lesson) => void;
  /** If true, hides the course title/description header */
  minimal?: boolean;
}

interface LessonProgress {
  [lessonId: string]: 'completed' | 'in_progress' | 'not_started';
}

export function CourseTableOfContents({
  course,
  currentLessonId,
  defaultOpenModuleId,
  onLessonClick,
  minimal = false
}: Props) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LessonProgress>({});
  const supabase = createClientBrowser();

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      const allLessonIds = course.modules.flatMap(module => module.lessons.map(lesson => lesson.id));

      const { data, error } = await supabase
        .from('user_progress')
        .select('lesson_id, status')
        .eq('user_id', user.id)
        .in('lesson_id', allLessonIds);

      if (error) {
        console.error('Error fetching progress:', error);
        return;
      }

      const progressMap: LessonProgress = {};
      data.forEach(item => {
        progressMap[item.lesson_id] = item.status;
      });

      // Set default status for lessons without progress
      allLessonIds.forEach(lessonId => {
        if (!progressMap[lessonId]) {
          progressMap[lessonId] = 'not_started';
        }
      });

      setProgress(progressMap);
    };

    fetchProgress();
  }, [user, course]);

  const getProgressIcon = (lessonId: string) => {
    const status = progress[lessonId] || 'not_started';

    if (status === 'completed') {
      return <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />;
    }
    return <Circle className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />;
  };

  const getModuleProgress = (module: Module) => {
    const totalLessons = module.lessons.length;
    const completedLessons = module.lessons.filter(lesson =>
      progress[lesson.id] === 'completed'
    ).length;
    return { completed: completedLessons, total: totalLessons };
  };

  return (
    <div className={cn("px-3 py-2", minimal && "py-0")}>
      {/* Only show header if not minimal */}
      {!minimal && (
        <div className="mb-3 px-1">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{course.title}</h2>
          {course.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{course.description}</p>
          )}
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={defaultOpenModuleId ? [defaultOpenModuleId] : course.modules.map((m) => m.id)}
        className="w-full space-y-1"
      >
        {course.modules.map((module) => {
          const moduleProgress = getModuleProgress(module);
          const showProgress = moduleProgress.total > 1; // Only show if more than 1 lesson

          return (
            <AccordionItem
              key={module.id}
              value={module.id}
              className="border-none"
            >
              <AccordionTrigger className="py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2 text-left">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {module.title}
                  </span>
                  {showProgress && (
                    <span className="text-xs text-gray-400 tabular-nums">
                      {moduleProgress.completed}/{moduleProgress.total}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-0">
                <ul className="space-y-0.5 pl-1">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button
                        onClick={() => onLessonClick(lesson)}
                        className={cn(
                          "w-full text-left py-2 px-2 rounded-md flex items-center gap-2 transition-colors text-sm",
                          lesson.id === currentLessonId
                            ? 'bg-forge-orange/10 text-forge-orange font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        )}
                      >
                        {getProgressIcon(lesson.id)}
                        <span className="flex-1 truncate">{lesson.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
