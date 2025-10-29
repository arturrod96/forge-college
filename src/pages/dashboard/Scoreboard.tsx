import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface ScoreboardEntry {
  id: string;
  name: string;
  email: string;
  xp: number;
  completedLessons: number;
  avatar?: string;
  pathName?: string;
}

// Mock data para scoreboard global
const MOCK_GLOBAL_SCOREBOARD: ScoreboardEntry[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    xp: 3420,
    completedLessons: 28,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@email.com',
    xp: 3180,
    completedLessons: 26,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    xp: 2950,
    completedLessons: 24,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'João Pedro',
    email: 'joao.pedro@email.com',
    xp: 2820,
    completedLessons: 23,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '5',
    name: 'Lucia Costa',
    email: 'lucia.costa@email.com',
    xp: 2650,
    completedLessons: 22,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '6',
    name: 'Rafael Mendes',
    email: 'rafael.mendes@email.com',
    xp: 2480,
    completedLessons: 20,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '7',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    xp: 2320,
    completedLessons: 19,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '8',
    name: 'Thiago Rocha',
    email: 'thiago.rocha@email.com',
    xp: 2180,
    completedLessons: 18,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face',
  },
];

// Mock data para scoreboard por paths
const MOCK_PATH_SCOREBOARDS = {
  'blockchain-web3': {
    name: 'Blockchain e Web3',
    entries: [
      {
        id: '1',
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        xp: 1850,
        completedLessons: 15,
        pathName: 'Blockchain e Web3',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '2',
        name: 'Carlos Santos',
        email: 'carlos.santos@email.com',
        xp: 1720,
        completedLessons: 14,
        pathName: 'Blockchain e Web3',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '4',
        name: 'João Pedro',
        email: 'joao.pedro@email.com',
        xp: 1650,
        completedLessons: 13,
        pathName: 'Blockchain e Web3',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '6',
        name: 'Rafael Mendes',
        email: 'rafael.mendes@email.com',
        xp: 1480,
        completedLessons: 12,
        pathName: 'Blockchain e Web3',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '8',
        name: 'Thiago Rocha',
        email: 'thiago.rocha@email.com',
        xp: 1320,
        completedLessons: 11,
        pathName: 'Blockchain e Web3',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face',
      },
    ]
  },
  'defi-protocols': {
    name: 'Protocolos DeFi',
    entries: [
      {
        id: '3',
        name: 'Maria Oliveira',
        email: 'maria.oliveira@email.com',
        xp: 1680,
        completedLessons: 14,
        pathName: 'Protocolos DeFi',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '5',
        name: 'Lucia Costa',
        email: 'lucia.costa@email.com',
        xp: 1520,
        completedLessons: 13,
        pathName: 'Protocolos DeFi',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '7',
        name: 'Fernanda Lima',
        email: 'fernanda.lima@email.com',
        xp: 1420,
        completedLessons: 12,
        pathName: 'Protocolos DeFi',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '2',
        name: 'Carlos Santos',
        email: 'carlos.santos@email.com',
        xp: 1380,
        completedLessons: 11,
        pathName: 'Protocolos DeFi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '1',
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        xp: 1280,
        completedLessons: 10,
        pathName: 'Protocolos DeFi',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      },
    ]
  },
  'smart-contracts': {
    name: 'Smart Contracts Avançados',
    entries: [
      {
        id: '6',
        name: 'Rafael Mendes',
        email: 'rafael.mendes@email.com',
        xp: 980,
        completedLessons: 8,
        pathName: 'Smart Contracts Avançados',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '4',
        name: 'João Pedro',
        email: 'joao.pedro@email.com',
        xp: 920,
        completedLessons: 7,
        pathName: 'Smart Contracts Avançados',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '8',
        name: 'Thiago Rocha',
        email: 'thiago.rocha@email.com',
        xp: 860,
        completedLessons: 7,
        pathName: 'Smart Contracts Avançados',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '3',
        name: 'Maria Oliveira',
        email: 'maria.oliveira@email.com',
        xp: 820,
        completedLessons: 6,
        pathName: 'Smart Contracts Avançados',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      },
      {
        id: '7',
        name: 'Fernanda Lima',
        email: 'fernanda.lima@email.com',
        xp: 780,
        completedLessons: 6,
        pathName: 'Smart Contracts Avançados',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
      },
    ]
  }
};

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

function ScoreboardList({ entries, title }: { entries: ScoreboardEntry[]; title: string }) {
  const { t } = useTranslation();
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
                      {entry.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{entry.name}</h4>
                    <p className="text-sm text-gray-500">{entry.email}</p>
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
  const [selectedPath, setSelectedPath] = useState<string>('blockchain-web3');

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
            entries={MOCK_GLOBAL_SCOREBOARD}
            title={t('scoreboard.rankingGlobal')}
          />
        </TabsContent>

        <TabsContent value="by-path" className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(MOCK_PATH_SCOREBOARDS).map(([key, path]) => (
              <button
                key={key}
                onClick={() => setSelectedPath(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPath === key
                    ? 'bg-forge-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {path.name}
              </button>
            ))}
          </div>

          <ScoreboardList
            entries={MOCK_PATH_SCOREBOARDS[selectedPath as keyof typeof MOCK_PATH_SCOREBOARDS].entries}
            title={t('scoreboard.ranking', { pathName: MOCK_PATH_SCOREBOARDS[selectedPath as keyof typeof MOCK_PATH_SCOREBOARDS].name })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
