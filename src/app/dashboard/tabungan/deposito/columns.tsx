import type { ColumnDef } from '@tanstack/react-table';
import type { Tabungan } from '@/types/tabungan';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const tabunganDepositoColumns: ColumnDef<Tabungan>[] = [
  { header: 'ID', accessorKey: 'id', size: 80 },
  { header: 'Anggota ID', accessorKey: 'anggota_id', size: 120 },
  {
    header: 'Saldo',
    accessorKey: 'saldo',
    size: 140,
    cell: ({ getValue }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(getValue() || 0)),
  },
  {
    header: 'Tgl Buka',
    accessorKey: 'tgl_buka',
    size: 140,
    cell: ({ getValue }) => {
      const v = String(getValue() ?? '');
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString();
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    size: 120,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/tabungan/deposito/${row.original.id}/edit`}>Edit</Link>
        </Button>
      </div>
    ),
  },
];

