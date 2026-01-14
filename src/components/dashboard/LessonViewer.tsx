import { Lesson, Course } from '@/pages/CourseView';
import { TextLesson } from '@/components/lessons/TextLesson';
import { VideoLesson } from '@/components/lessons/VideoLesson';
import { QuizLesson } from '@/components/lessons/QuizLesson';

interface Props {
  lesson: Lesson | null;
  course: Course | null;
}

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
    <div className="flex-1 flex flex-col bg-white rounded-lg sm:rounded-xl shadow-sm border">
      {/* Responsive header padding */}
      <div className="p-4 sm:p-6 border-b">
        <h1 className="text-xl sm:text-2xl font-bold text-forge-dark mb-1 sm:mb-2">{lesson.title}</h1>
        <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
          <span>Lesson {currentIndex + 1} of {allLessons.length}</span>
          <span>•</span>
          <span className="text-forge-orange font-medium">{lesson.xp_value} XP</span>
        </div>
      </div>

      {/* Responsive content padding */}
      <div className="flex-1 p-4 sm:p-6">
        {renderLessonContent()}
      </div>
    </div>
  );
}
