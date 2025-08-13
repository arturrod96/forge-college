import { Lesson, Course } from '@/pages/CourseView';
import { Button } from '@/components/ui/button';
import { TextLesson } from '@/components/lessons/TextLesson';
import { VideoLesson } from '@/components/lessons/VideoLesson';
import { QuizLesson } from '@/components/lessons/QuizLesson';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  lesson: Lesson | null;
  course: Course | null;
  onLessonChange: (lesson: Lesson) => void;
}

export function LessonViewer({ lesson, course, onLessonChange }: Props) {
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);

  if (!lesson) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Selecione uma lição para começar.</p>
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
      toast.error('Você precisa estar logado para marcar progresso');
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

      if (error) throw error;

      toast.success('Lição marcada como concluída!');
      
      // Auto navigate to next lesson if available
      if (nextLesson) {
        onLessonChange(nextLesson);
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast.error('Erro ao marcar lição como concluída');
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
        return <div className="text-red-500">Tipo de lição não suportado: {lesson.lesson_type}</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-white">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <div className="text-sm text-gray-500 mt-2">
          Lição {currentIndex + 1} de {allLessons.length} • {lesson.xp_value} XP
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
          Lição Anterior
        </Button>
        <Button 
          onClick={markAsComplete}
          disabled={isCompleting}
        >
          {isCompleting ? 'Salvando...' : nextLesson ? 'Concluir e Continuar' : 'Marcar como Concluída'}
        </Button>
      </footer>
    </div>
  );
}
