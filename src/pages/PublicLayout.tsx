import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
