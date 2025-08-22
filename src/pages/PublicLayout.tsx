import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
}
