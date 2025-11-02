import { FormationsList } from '@/components/dashboard/FormationsList';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function FormationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Formations</h1>
            <p className="text-gray-600">Comprehensive learning programs designed to advance your career</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">What are Formations?</h3>
          <p className="text-blue-800 text-sm">
            Formations are structured learning programs that combine multiple learning paths into a comprehensive curriculum. 
            Each formation is carefully designed to take you from beginner to advanced level in specific career tracks.
          </p>
        </div>
      </div>

      {/* Formations Grid */}
      <FormationsList />
      
      {/* Admin Link */}
      <div className="text-center pt-8 border-t">
        <p className="text-sm text-gray-500 mb-3">
          Are you an instructor? Create and manage formations.
        </p>
        <Link 
          to="/dashboard/admin/formations"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Admin Panel
        </Link>
      </div>
    </div>
  );
}
