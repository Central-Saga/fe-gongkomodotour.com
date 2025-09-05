import type { ColumnDef } from '@tanstack/react-table';
import type { Role } from '@/types/role';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const roleColumns: ColumnDef<Role>[] = [
  {
    header: 'ID',
    accessorKey: 'id',
    size: 80,
  },
  {
    header: 'Nama Role',
    accessorKey: 'name',
    cell: ({ row }) => (
      <Link href={`/dashboard/roles/${row.original.id}/edit`} className="hover:underline">
        {row.original.name}
      </Link>
    ),
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
            <Link href={`/dashboard/roles/${row.original.id}/edit`}>Edit</Link>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(row.original.id)}>Hapus</Button>
        </div>
      );
    },
  },
];

