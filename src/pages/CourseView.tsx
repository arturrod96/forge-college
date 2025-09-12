import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createClientBrowser } from '@/lib/supabase';
import { CourseTableOfContents } from '@/components/dashboard/CourseTableOfContents';
import { LessonViewer } from '@/components/dashboard/LessonViewer';

export type LessonType = 'text' | 'video' | 'quiz';

export interface Lesson {
  id: string;
  title: string;
  content: unknown;
  lesson_type: LessonType;
  xp_value: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export function CourseView() {
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const supabase = createClientBrowser();

  const { data: course, isLoading } = useQuery<Course | null>({
    queryKey: ['courseView', courseId],
    enabled: Boolean(courseId),
    queryFn: async () => {
      const { data: courseData, error } = await supabase
        .from('courses')
        .select(`
          id, title, description,
          modules:modules(id, title, order,
            lessons:lessons(id, title, content, lesson_type, order, xp_value)
          )
        `)
        .eq('id', courseId)
        .single();
      if (error) throw new Error(error.message || 'Failed to load course');

      const normalized: Course = {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        modules: (courseData.modules || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          lessons: (m.lessons || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            content: l.content,
            lesson_type: l.lesson_type,
            xp_value: l.xp_value ?? 0,
          })),
        })),
      };

      // pick first lesson by default
      if (normalized.modules.length && normalized.modules[0].lessons.length) {
        setCurrentLesson(normalized.modules[0].lessons[0]);
      }

      return normalized;
    },
  });

  return (
    <div className="flex gap-6">
      <div className="w-80 shrink-0 border rounded-md bg-white">
        {isLoading || !course ? (
          <div className="p-4 text-gray-500">Loading course...</div>
        ) : (
          <CourseTableOfContents
            course={course}
            currentLessonId={currentLesson?.id}
            onLessonClick={setCurrentLesson}
          />
        )}
      </div>
      <div className="flex-1 border rounded-md bg-white min-h-[60vh]">
        <LessonViewer lesson={currentLesson} course={course ?? null} onLessonChange={setCurrentLesson} />
      </div>
    </div>
  );
}

export default CourseView;
