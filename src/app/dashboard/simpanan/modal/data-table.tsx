'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Simpanan } from '@/types/simpanan';
import { simpananModalColumns } from './columns';

export default function SimpananModalDataTable() {
  return (
    <StandardDataTable<Simpanan>
      columns={simpananModalColumns}
      listUrl="/api/simpanan?jenis=modal"
      createHref="/dashboard/simpanan/modal/create"
      createLabel="Tambah Simpanan Modal"
      onDeleteUrl={(id) => `/api/simpanan/${id}`}
      searchPlaceholder="Cari simpanan..."
      emptyText="Belum ada simpanan modal"
    />
  );
}

