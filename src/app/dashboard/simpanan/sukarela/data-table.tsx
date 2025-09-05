'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Simpanan } from '@/types/simpanan';
import { simpananSukarelaColumns } from './columns';

export default function SimpananSukarelaDataTable() {
  return (
    <StandardDataTable<Simpanan>
      columns={simpananSukarelaColumns}
      listUrl="/api/simpanan?jenis=sukarela"
      createHref="/dashboard/simpanan/sukarela/create"
      createLabel="Tambah Simpanan Sukarela"
      onDeleteUrl={(id) => `/api/simpanan/${id}`}
      searchPlaceholder="Cari simpanan..."
      emptyText="Belum ada simpanan sukarela"
    />
  );
}

