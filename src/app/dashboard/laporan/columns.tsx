import type { ColumnDef } from '@tanstack/react-table';

type Laporan = {
  id: number;
  judul: string;
  tanggal: string;
  deskripsi?: string | null;
};

export const laporanColumns: ColumnDef<Laporan>[] = [
  { header: 'ID', accessorKey: 'id', size: 80 },
  { header: 'Judul', accessorKey: 'judul' },
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
];

