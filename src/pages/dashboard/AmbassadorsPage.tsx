import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

export default function AmbassadorsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-forge-dark">Ambassadors</h1>
        <p className="text-muted-foreground">Join our community of ambassadors and help spread knowledge</p>
      </div>

      <div className="rounded-lg border border-forge-cream/80 bg-forge-cream/30 p-8 text-center">
        <Users className="h-12 w-12 text-forge-orange/40 mx-auto mb-4" />
        <p className="text-muted-foreground">Ambassadors program coming soon</p>
      </div>
    </div>
  );
}
