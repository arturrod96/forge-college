import { Course, Module, Lesson } from '@/pages/CourseView';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Circle, Play } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  course: Course;
  currentLessonId?: string;
  onLessonClick: (lesson: Lesson) => void;
}

interface LessonProgress {
  [lessonId: string]: 'completed' | 'in_progress' | 'not_started';
}

export function CourseTableOfContents({ course, currentLessonId, onLessonClick }: Props) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LessonProgress>({});

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
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getModuleProgress = (module: Module) => {
    const totalLessons = module.lessons.length;
    const completedLessons = module.lessons.filter(lesson => 
      progress[lesson.id] === 'completed'
    ).length;
    return { completed: completedLessons, total: totalLessons };
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{course.title}</h2>
      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
      <Accordion type="multiple" defaultValue={course.modules.map(m => m.id)} className="w-full">
        {course.modules.map((module) => {
          const moduleProgress = getModuleProgress(module);
          return (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full pr-4">
                  <span>{module.title}</span>
                  <span className="text-sm text-gray-500">
                    {moduleProgress.completed}/{moduleProgress.total}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul>
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button 
                        onClick={() => onLessonClick(lesson)}
                        className={`w-full text-left p-2 rounded-md flex items-center gap-2 transition-colors ${
                          lesson.id === currentLessonId 
                            ? 'bg-blue-100 border-l-4 border-blue-500' 
                            : 'hover:bg-gray-100'
                        }`}>
                        {getProgressIcon(lesson.id)}
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-gray-500">{lesson.xp_value} XP</span>
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
