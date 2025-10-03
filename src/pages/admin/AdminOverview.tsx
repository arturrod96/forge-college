import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layers3, BookOpen, ListChecks, FileText, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useOAuth'

const overviewItems = [
  {
    label: 'Learning Paths',
    description: 'Create thematic journeys and bundle courses together.',
    icon: Layers3,
  },
  {
    label: 'Courses',
    description: 'Organize syllabus, outcomes, and prerequisites.',
    icon: BookOpen,
  },
  {
    label: 'Modules',
    description: 'Group lessons under clear learning milestones.',
    icon: ListChecks,
  },
  {
    label: 'Lessons',
    description: 'Publish text, video, or quiz content for builders.',
    icon: FileText,
  },
]

export function AdminOverview() {
  const { user } = useAuth()

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="lg:col-span-2 border-forge-cream/80 bg-white/80">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-forge-dark">
            <ShieldCheck className="h-5 w-5 text-forge-orange" />
            Admin Access Granted
          </CardTitle>
          <p className="text-sm text-forge-gray">
            {user?.email ? `Managing content as ${user.email}.` : 'Manage platform content.'}
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {overviewItems.map((item) => (
            <div
              key={item.label}
              className="flex gap-3 rounded-xl border border-dashed border-forge-cream/60 bg-forge-cream/20 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forge-orange/10 text-forge-orange">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-forge-dark">{item.label}</p>
                <p className="text-sm text-forge-gray">{item.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminOverview
