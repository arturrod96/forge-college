import { ComingSoonPaths } from '@/components/dashboard/ComingSoonPaths';
import { Clock, Bell } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coming Soon</h1>
            <p className="text-gray-600">Be the first to know when new learning paths launch</p>
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">Join the Waiting List</h3>
          <p className="text-orange-800 text-sm">
            Get notified as soon as these learning paths become available. 
            Join the waiting list to secure your spot and receive exclusive updates.
          </p>
        </div>
      </div>

      {/* Coming Soon Paths */}
      <ComingSoonPaths />
      
      {/* Info Section */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We're constantly working on new learning paths. Check back regularly or join our waiting lists 
          to be the first to know when new content is available.
        </p>
      </div>
    </div>
  );
}
