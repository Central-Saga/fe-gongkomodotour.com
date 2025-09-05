import type { ColumnDef } from '@tanstack/react-table';
import type { Simpanan } from '@/types/simpanan';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const simpananKhususColumns: ColumnDef<Simpanan>[] = [
  { header: 'ID', accessorKey: 'id', size: 80 },
  { header: 'Anggota ID', accessorKey: 'anggota_id', size: 120 },
  {
    header: 'Nominal',
    accessorKey: 'nominal',
    size: 140,
    cell: ({ getValue }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(getValue() || 0)),
  },
  {
    header: 'Tanggal',
    accessorKey: 'tanggal',
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
    cell: ({ getValue }) => String(getValue() ?? ''),
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
            <Link href={`/dashboard/simpanan/khusus/${row.original.id}/edit`}>Edit</Link>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(row.original.id)}>Hapus</Button>
        </div>
      );
    },
  },
];

