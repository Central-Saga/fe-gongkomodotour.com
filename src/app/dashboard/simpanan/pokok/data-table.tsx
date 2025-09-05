'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Simpanan } from '@/types/simpanan';
import { simpananPokokColumns } from './columns';

export default function SimpananPokokDataTable() {
  return (
    <StandardDataTable<Simpanan>
      columns={simpananPokokColumns}
      listUrl="/api/simpanan?jenis=pokok"
      createHref="/dashboard/simpanan/pokok/create"
      createLabel="Tambah Simpanan Pokok"
      onDeleteUrl={(id) => `/api/simpanan/${id}`}
      searchPlaceholder="Cari simpanan..."
      emptyText="Belum ada simpanan pokok"
    />
  );
}

