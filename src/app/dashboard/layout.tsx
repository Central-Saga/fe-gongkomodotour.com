import type { ReactNode } from 'react';
import DashboardSidebar from '@/components/layout/dashboard-sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full grid grid-cols-[248px_1fr]">
      <DashboardSidebar />
      <main className="min-h-screen">{children}</main>
    </div>
  );
}

