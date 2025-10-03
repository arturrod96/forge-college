import { useEffect, useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createClientBrowser } from '@/lib/supabase';
import { CourseTableOfContents } from '@/components/dashboard/CourseTableOfContents';
import { LessonViewer } from '@/components/dashboard/LessonViewer';
import LessonAIChat from '@/components/ai/LessonAIChat';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DASHBOARD, DASHBOARD_EXPLORE } from '@/routes/paths';

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

type DashboardOutletContext = { setHeaderBreadcrumb: (node: React.ReactNode | null) => void }

export function CourseView() {
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const supabase = createClientBrowser();
  const { setHeaderBreadcrumb } = useOutletContext<DashboardOutletContext>();

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

      type SupabaseLesson = {
        id: string
        title: string
        content: unknown
        lesson_type: LessonType
        order: number | null
        xp_value: number | null
      }

      type SupabaseModule = {
        id: string
        title: string
        order: number | null
        lessons?: SupabaseLesson[] | null
      }

      type SupabaseCourse = {
        id: string
        title: string
        description: string
        modules?: SupabaseModule[] | null
      }

      const typedCourse = courseData as SupabaseCourse

      const normalized: Course = {
        id: typedCourse.id,
        title: typedCourse.title,
        description: typedCourse.description,
        modules: (typedCourse.modules ?? [])
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((module) => ({
            id: module.id,
            title: module.title,
            lessons: (module.lessons ?? [])
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                content: lesson.content,
                lesson_type: lesson.lesson_type,
                xp_value: lesson.xp_value ?? 0,
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

  useEffect(() => {
    if (!course) return
    const crumb = (
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
          {currentLesson && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLesson.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    )
    setHeaderBreadcrumb(crumb)
    return () => setHeaderBreadcrumb(null)
  }, [course?.title, currentLesson?.title, setHeaderBreadcrumb])

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
      <div className="w-96 shrink-0 hidden md:block sticky top-6 self-start h-[calc(100vh-7rem)] max-h-[calc(100vh-7rem)]">
        <LessonAIChat
          courseTitle={course?.title}
          lessonTitle={currentLesson?.title}
          lessonType={currentLesson?.lesson_type}
          lessonContent={currentLesson?.content}
        />
      </div>
    </div>
  );
}

export default CourseView;
