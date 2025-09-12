import { Lesson, Course } from '@/pages/CourseView';
import { Button } from '@/components/ui/button';
import { TextLesson } from '@/components/lessons/TextLesson';
import { VideoLesson } from '@/components/lessons/VideoLesson';
import { QuizLesson } from '@/components/lessons/QuizLesson';
import { useAuth } from '@/hooks/useOAuth';
import { createClientBrowser } from '@/lib/supabase';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DASHBOARD, DASHBOARD_EXPLORE } from '@/routes/paths';
import { toast } from 'sonner';

interface Props {
  lesson: Lesson | null;
  course: Course | null;
  onLessonChange: (lesson: Lesson) => void;
}

export function LessonViewer({ lesson, course, onLessonChange }: Props) {
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);
  const supabase = createClientBrowser();

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Select a lesson to begin.</p>
      </div>
    );
  }

  // Find current lesson index and navigation helpers
  const getAllLessons = () => {
    if (!course) return [];
    return course.modules.flatMap(module => module.lessons);
  };

  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const markAsComplete = async () => {
    if (!user) {
      toast.error('You need to be logged in to track progress');
      return;
    }

    setIsCompleting(true);
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lesson.id,
            status: 'completed',
            completed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) throw new Error(error.message || 'Failed to save progress');

      toast.success('Lesson marked as completed!');
      
      // Auto navigate to next lesson if available
      if (nextLesson) {
        onLessonChange(nextLesson);
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast.error('Error marking lesson as completed');
    } finally {
      setIsCompleting(false);
    }
  };

  const renderLessonContent = () => {
    switch (lesson.lesson_type) {
      case 'text':
        return <TextLesson content={lesson.content} />;
      case 'video':
        return <VideoLesson videoUrl={lesson.content} />;
      case 'quiz':
        return <QuizLesson quizData={typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content} />;
      default:
        return <div className="text-red-500">Unsupported lesson type: {lesson.lesson_type}</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-white">
      <header className="mb-6 space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={DASHBOARD}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={DASHBOARD_EXPLORE}>Paths</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {course && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{course.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{lesson.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <div className="text-sm text-gray-500 mt-1">
          Lesson {currentIndex + 1} of {allLessons.length} • {lesson.xp_value} XP
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        {renderLessonContent()}
      </div>

      <footer className="mt-6 border-t pt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => previousLesson && onLessonChange(previousLesson)}
          disabled={!previousLesson}
        >
          Previous lesson
        </Button>
        <Button 
          onClick={markAsComplete}
          disabled={isCompleting}
        >
          {isCompleting ? 'Saving...' : nextLesson ? 'Complete and Continue' : 'Mark as Completed'}
        </Button>
      </footer>
    </div>
  );
}
