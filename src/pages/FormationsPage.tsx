import { FormationsList } from '@/components/dashboard/FormationsList';
import { Link } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';

export default function FormationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Formations</h1>
          <p className="text-gray-600">Comprehensive learning programs designed to advance your career</p>
        </div>
      </div>

      {/* Formations Grid */}
      <FormationsList />
      
      {/* Admin Link */}
      <div className="text-center pt-8 border-t">
        <p className="text-sm text-gray-500 mb-3">
          Are you an instructor? Create and manage formations.
        </p>
        <Link to="/dashboard/admin/formations">
          <EnhancedButton variant="primary" size="md">
            Admin Panel
          </EnhancedButton>
        </Link>
      </div>
    </div>
  );
}
