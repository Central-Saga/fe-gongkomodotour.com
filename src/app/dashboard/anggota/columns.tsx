import type { ColumnDef } from '@tanstack/react-table';
import type { Anggota } from '@/types/anggota';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const anggotaColumns: ColumnDef<Anggota>[] = [
  {
    header: 'NIK',
    accessorKey: 'nik',
    size: 160,
  },
  {
    header: 'Nama',
    accessorKey: 'nama',
    cell: ({ row }) => (
      <Link href={`/dashboard/anggota/${row.original.id}`} className="hover:underline">
        {row.original.nama}
      </Link>
    ),
  },
    {
    header: 'No. HP',
    accessorKey: 'no_hp',
    size: 140,
  },
  {
    header: 'Tgl Gabung',
    accessorKey: 'tgl_gabung',
    size: 140,
    cell: ({ getValue }) => {
      const v = String(getValue() ?? '');
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString();
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    size: 110,
    cell: ({ getValue }) => {
      const status = Number(getValue());
      const map: Record<number, { text: string; color: string }> = {
        0: { text: 'Non Aktif', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
        1: { text: 'Aktif', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      };
      const v = map[status] ?? { text: String(status), color: 'bg-muted text-foreground' };
      return <span className={`px-2 py-0.5 rounded text-xs ${v.color}`}>{v.text}</span>;
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    size: 120,
    cell: ({ row, table }) => {
      const onDelete = (table?.options?.meta as any)?.onDelete as ((id: number) => void) | undefined;
      return (
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/anggota/${row.original.id}/edit`}>Edit</Link>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(row.original.id)}>Hapus</Button>
        </div>
      );
    },
  },
];
