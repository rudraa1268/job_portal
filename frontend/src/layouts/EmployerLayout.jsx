import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar, { employerLinks } from '../components/Sidebar';

export default function EmployerLayout() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
        <Sidebar links={employerLinks} />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
