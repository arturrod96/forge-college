import { Lesson, Course } from '@/pages/CourseView';
import { TextLesson } from '@/components/lessons/TextLesson';
import { VideoLesson } from '@/components/lessons/VideoLesson';
import { QuizLesson } from '@/components/lessons/QuizLesson';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
  lesson: Lesson | null;
  course: Course | null;
}

export function LessonViewer({ lesson, course }: Props) {
  const { t } = useTranslation();

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-gray-500">{t('lessons.selectToBegin')}</p>
      </div>
    );
  }

  // Find current lesson index for display
  const allLessons = course?.modules.flatMap(module => module.lessons) ?? [];
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);

  const renderLessonContent = () => {
    switch (lesson.lesson_type) {
      case 'text':
        return <TextLesson content={typeof lesson.content === 'string' ? lesson.content : ''} />;
      case 'video':
        return <VideoLesson videoUrl={typeof lesson.content === 'string' ? lesson.content : ''} />;
      case 'quiz':
        return <QuizLesson quizData={typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content} />;
      default:
        return <div className="text-red-500">{t('lessons.unsupportedType', { type: lesson.lesson_type })}</div>;
    }
  };

  return (
    <article className="flex-1 flex flex-col">
      {/* Immersive Header - No card container, clean typography */}
      <header className="mb-6 sm:mb-8">
        {/* Lesson metadata */}
        <div className="flex items-center gap-3 mb-3 text-sm">
          <span className="text-gray-500">
            {t('lessons.lessonInfo', { current: currentIndex + 1, total: allLessons.length, xp: lesson.xp_value })}
          </span>
        </div>

        {/* Lesson title - Large and prominent */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
          {lesson.title}
        </h1>
      </header>

      {/* Content Area - Full width, clean */}
      <div className={cn(
        "flex-1",
        // For video lessons, remove horizontal padding for immersive video
        lesson.lesson_type === 'video' && "-mx-4 sm:-mx-6 lg:-mx-10 xl:-mx-12"
      )}>
        {/* Content wrapper with subtle card for text/quiz, full-bleed for video */}
        <div className={cn(
          lesson.lesson_type !== 'video' && "bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 sm:p-8"
        )}>
          {renderLessonContent()}
        </div>
      </div>
    </article>
  );
}
