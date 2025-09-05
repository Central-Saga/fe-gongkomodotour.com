'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Role } from '@/types/role';
import { roleColumns } from './columns';

export default function RolesDataTable() {
  return (
    <StandardDataTable<Role>
      columns={roleColumns}
      listUrl="/api/roles"
      createHref="/dashboard/roles/create"
      createLabel="Tambah Role"
      onDeleteUrl={(id) => `/api/roles/${id}`}
      searchPlaceholder="Cari role..."
      emptyText="Belum ada role"
    />
  );
}

