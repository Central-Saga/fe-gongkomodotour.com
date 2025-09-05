import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/types/users';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const userColumns: ColumnDef<User>[] = [
  { header: 'ID', accessorKey: 'id', size: 80 },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => (
      <Link href={`/dashboard/users/${row.original.id}/edit`} className="hover:underline">
        {row.original.email}
      </Link>
    ),
  },
  { header: 'Anggota ID', accessorKey: 'anggota_id', size: 120 },
  {
    id: 'actions',
    header: 'Aksi',
    size: 140,
    cell: ({ row, table }) => {
      const onDelete = (table?.options?.meta as any)?.onDelete as ((id: number) => void) | undefined;
      return (
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/users/${row.original.id}/edit`}>Edit</Link>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(row.original.id)}>Hapus</Button>
        </div>
      );
    },
  },
];

