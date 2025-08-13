import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { CourseTableOfContents } from '@/components/dashboard/CourseTableOfContents';
import { LessonViewer } from '@/components/dashboard/LessonViewer';

// Define types for our data structure
export interface Lesson {
  id: string;
  title: string;
  content: any; // Can be text, video URL, quiz data, etc.
  lesson_type: 'text' | 'video' | 'quiz';
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
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      setLoading(true);
      // This is a complex query to fetch a course and its nested modules and lessons.
      // Supabase's RPC functions might be more efficient for this in the long run.
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id, title, description,
          modules ( id, title, order, lessons ( id, title, content, lesson_type, order ) )
        `)
        .eq('id', courseId)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        setCourse(null);
      } else {
        // Sort modules and lessons by their order
        data.modules.sort((a, b) => a.order - b.order);
        data.modules.forEach(module => {
          module.lessons.sort((a, b) => a.order - b.order);
        });
        setCourse(data as Course);
        // Set the first lesson as the current one by default
        if (data.modules[0]?.lessons[0]) {
          setCurrentLesson(data.modules[0].lessons[0]);
        }
      }
      setLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading course...</div>;
  }

  if (!course) {
    return <div className="flex justify-center items-center h-screen">Course not found.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Table of Contents */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <CourseTableOfContents 
          course={course} 
          currentLessonId={currentLesson?.id}
          onLessonClick={(lesson) => setCurrentLesson(lesson)}
        />
      </div>

      {/* Right Content - Lesson Viewer */}
      <div className="w-3/4 flex flex-col">
        <LessonViewer 
          lesson={currentLesson} 
          course={course}
          onLessonChange={(lesson) => setCurrentLesson(lesson)}
        />
      </div>
    </div>
  );
}
