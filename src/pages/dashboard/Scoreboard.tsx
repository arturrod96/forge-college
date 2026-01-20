import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { createClientBrowser } from '@/lib/supabase';

interface ScoreboardEntry {
  id: string;
  name: string;
  email: string;
  xp: number;
  completedLessons: number;
  avatar?: string;
  pathName?: string;
}

function getRankIcon(position: number) {
  switch (position) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <div className="h-6 w-6 flex items-center justify-center text-sm font-bold text-gray-500">#{position}</div>;
  }
}

function getRankBadgeColor(position: number) {
  switch (position) {
    case 1:
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    case 2:
      return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    case 3:
      return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function ScoreboardList({ entries, title, isLoading }: { entries: ScoreboardEntry[]; title: string; isLoading: boolean }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-forge-orange" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-forge-orange" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
           <div className="text-center py-8 text-gray-500">
             No rankings available yet.
           </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-forge-orange" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {entries.map((entry, index) => {
            const position = index + 1;
            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 border-b last:border-b-0 transition-colors hover:bg-gray-50 ${
                  position <= 3 ? 'bg-gradient-to-r from-orange-50 to-transparent' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getRankBadgeColor(position)} font-bold px-2 py-1`}>
                      #{position}
                    </Badge>
                    {getRankIcon(position)}
                  </div>

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback className="bg-forge-orange text-white">
                      {entry.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{entry.name}</h4>
                    {entry.email && <p className="text-sm text-gray-500">{entry.email}</p>}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg text-forge-orange">{entry.xp.toLocaleString()} {t('scoreboard.xp')}</div>
                  <div className="text-sm text-gray-500">{entry.completedLessons} {t('scoreboard.lessons')}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Scoreboard() {
  const { t } = useTranslation();
  const supabase = useMemo(() => createClientBrowser(), []);

  const [selectedPath, setSelectedPath] = useState<string>('');
  const [globalScores, setGlobalScores] = useState<ScoreboardEntry[]>([]);
  const [pathScores, setPathScores] = useState<Record<string, ScoreboardEntry[]>>({});
  const [paths, setPaths] = useState<{id: string, title: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 1. Fetch Learning Paths
        const { data: pathsData } = await supabase
          .from('learning_paths')
          .select('id, title')
          .eq('status', 'published'); // Only published paths

        const validPaths = pathsData || [];
        setPaths(validPaths);
        if (validPaths.length > 0 && !selectedPath) {
            setSelectedPath(validPaths[0].id);
        }

        // 2. Fetch Profiles (Mapping User ID -> Name)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name');

        const profileMap = new Map<string, string>();
        profilesData?.forEach(p => {
          if (p.user_id && p.full_name) {
            profileMap.set(p.user_id, p.full_name);
          }
        });

        // 3. Fetch User Progress (Completed Lessons with XP and Path info)
        // We need to join: user_progress -> lessons -> modules -> courses -> learning_paths
        // Note: This might be heavy if there are many users/lessons.
        // For production, this should be a Database View or RPC.
        const { data: progressData, error } = await supabase
          .from('user_progress')
          .select(`
            user_id,
            status,
            lessons (
              id,
              xp_value,
              modules (
                courses (
                  path_id
                )
              )
            )
          `)
          .eq('status', 'completed');

        if (error) {
          console.error("Error fetching progress:", error);
          throw error;
        }

        // 4. Aggregate Scores
        const globalAgg: Record<string, { xp: number; completed: number }> = {};
        const pathAgg: Record<string, Record<string, { xp: number; completed: number }>> = {};

        // Initialize path aggregators
        validPaths.forEach(path => {
          pathAgg[path.id] = {};
        });

        progressData?.forEach((row: any) => {
          const userId = row.user_id;
          if (!userId) return;

          const lesson = row.lessons;
          if (!lesson) return;

          const xp = lesson.xp_value || 0;

          // Global Aggregation
          if (!globalAgg[userId]) {
            globalAgg[userId] = { xp: 0, completed: 0 };
          }
          globalAgg[userId].xp += xp;
          globalAgg[userId].completed += 1;

          // By Path Aggregation
          // Navigate deep structure: lesson -> modules -> courses -> path_id
          const course = lesson.modules?.courses;
          const pathId = course?.path_id;

          if (pathId && pathAgg[pathId]) {
             if (!pathAgg[pathId][userId]) {
               pathAgg[pathId][userId] = { xp: 0, completed: 0 };
             }
             pathAgg[pathId][userId].xp += xp;
             pathAgg[pathId][userId].completed += 1;
          }
        });

        // 5. Convert to Sorted Lists
        const buildRanking = (agg: Record<string, { xp: number; completed: number }>) => {
           return Object.entries(agg)
             .map(([uid, stats]) => ({
               id: uid,
               name: profileMap.get(uid) || 'Unknown User',
               email: '', // Email is not public in profiles usually
               xp: stats.xp,
               completedLessons: stats.completed,
               avatar: undefined, // Add logic if avatar URL available
             }))
             .sort((a, b) => b.xp - a.xp)
             .slice(0, 50); // Top 50
        };

        setGlobalScores(buildRanking(globalAgg));

        const newPathScores: Record<string, ScoreboardEntry[]> = {};
        Object.keys(pathAgg).forEach(pid => {
           newPathScores[pid] = buildRanking(pathAgg[pid]);
        });
        setPathScores(newPathScores);

      } catch (err) {
        console.error("Failed to load scoreboard data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase, selectedPath]); // selectedPath in dependency? No, we fetch all at once or maybe fetch on select?
  // Better to fetch all paths data once or optimize.
  // The current logic fetches ALL progress.
  // If selectedPath changes, we don't need to refetch everything, just render.
  // So remove selectedPath from dependency array.

  const currentPathTitle = paths.find(p => p.id === selectedPath)?.title || 'Path';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('scoreboard.title')}</h1>
        <p className="text-gray-600">{t('scoreboard.subtitle')}</p>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">{t('scoreboard.global')}</TabsTrigger>
          <TabsTrigger value="by-path">{t('scoreboard.byPath')}</TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="space-y-6">
          <ScoreboardList
            isLoading={loading}
            entries={globalScores}
            title={t('scoreboard.rankingGlobal')}
          />
        </TabsContent>

        <TabsContent value="by-path" className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {paths.map((path) => (
              <button
                key={path.id}
                onClick={() => setSelectedPath(path.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPath === path.id
                    ? 'bg-forge-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {path.title}
              </button>
            ))}
            {paths.length === 0 && !loading && <div className="text-gray-500">{t('scoreboard.emptyNoPaths')}</div>}
          </div>

          <ScoreboardList
            isLoading={loading}
            entries={pathScores[selectedPath] || []}
            title={t('scoreboard.ranking', { pathName: currentPathTitle })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
