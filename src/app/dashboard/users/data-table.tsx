'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { User } from '@/types/users';
import { userColumns } from './columns';

export default function UserDataTable() {
  return (
    <StandardDataTable<User>
      columns={userColumns}
      listUrl="/api/users"
      createHref="/dashboard/users/create"
      createLabel="Tambah User"
      onDeleteUrl={(id) => `/api/users/${id}`}
      searchPlaceholder="Cari user..."
      emptyText="Belum ada user"
    />
  );
}

