import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface RecentCourse {
  id: string;
  title: string;
  description: string;
}

export function ContinueLearningCard() {
  const { user } = useAuth();
  const [recentCourse, setRecentCourse] = useState<RecentCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRecentCourse = async () => {
      setLoading(true);

      // Find the most recently completed lesson for the user
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (progressError || !progressData) {
        setLoading(false);
        return; // No progress yet
      }

      // From that lesson, find its course
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('modules(courses(id, title, description))')
        .eq('id', progressData.lesson_id)
        .single();

      if (lessonError || !lessonData) {
        console.error('Error fetching lesson data');
        setLoading(false);
        return;
      }

      const course = lessonData.modules.courses;
      setRecentCourse(course);
      setLoading(false);
    };

    fetchRecentCourse();
  }, [user]);

  if (loading || !recentCourse) {
    return null; // Don't show the card if there's no recent activity
  }

  return (
    <Card className="bg-blue-50 border-blue-200 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Pick up where you left off</CardTitle>
        <CardDescription>You were working on:</CardDescription>
        <p className="text-xl font-semibold pt-2">{recentCourse.title}</p>
      </CardHeader>
      <CardContent>
        <Link to={`/dashboard/learn/course/${recentCourse.id}`}>
          <Button size="lg" className="w-full md:w-auto">Continue Learning</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
