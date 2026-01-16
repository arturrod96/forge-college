import { Lesson, Course } from '@/pages/CourseView';
import { TextLesson } from '@/components/lessons/TextLesson';
import { VideoLesson } from '@/components/lessons/VideoLesson';
import { QuizLesson } from '@/components/lessons/QuizLesson';
import { Play, FileText, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  lesson: Lesson | null;
  course: Course | null;
}

const lessonTypeConfig = {
  video: { icon: Play, label: 'Vídeo', color: 'text-blue-500' },
  text: { icon: FileText, label: 'Leitura', color: 'text-emerald-500' },
  quiz: { icon: HelpCircle, label: 'Quiz', color: 'text-purple-500' },
};

export function LessonViewer({ lesson, course }: Props) {
  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-gray-500">Select a lesson to begin.</p>
      </div>
    );
  }

  // Find current lesson index for display
  const allLessons = course?.modules.flatMap(module => module.lessons) ?? [];
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);

  const typeConfig = lessonTypeConfig[lesson.lesson_type] || lessonTypeConfig.text;
  const TypeIcon = typeConfig.icon;

  const renderLessonContent = () => {
    switch (lesson.lesson_type) {
      case 'text':
        return <TextLesson content={typeof lesson.content === 'string' ? lesson.content : ''} />;
      case 'video':
        return <VideoLesson videoUrl={typeof lesson.content === 'string' ? lesson.content : ''} />;
      case 'quiz':
        return <QuizLesson quizData={typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content} />;
      default:
        return <div className="text-red-500">Unsupported lesson type: {lesson.lesson_type}</div>;
    }
  };

  return (
    <article className="flex-1 flex flex-col">
      {/* Immersive Header - No card container, clean typography */}
      <header className="mb-6 sm:mb-8">
        {/* Lesson metadata */}
        <div className="flex items-center gap-3 mb-3 text-sm">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium",
            "bg-gray-100 dark:bg-gray-800",
            typeConfig.color
          )}>
            <TypeIcon className="w-3.5 h-3.5" />
            {typeConfig.label}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">
            Lição {currentIndex + 1} de {allLessons.length}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-forge-orange font-semibold">{lesson.xp_value} XP</span>
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
