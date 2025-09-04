import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnggotaDataTable from './data-table';

export default function AnggotaPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Anggota</h1>
          <p className="text-sm text-muted-foreground">Daftar anggota berdasarkan data backend.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/anggota/create">Tambah Anggota</Link>
        </Button>
      </div>

      <AnggotaDataTable />
    </div>
  );
}
