'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Simpanan } from '@/types/simpanan';
import { simpananWajibColumns } from './columns';

export default function SimpananWajibDataTable() {
  return (
    <StandardDataTable<Simpanan>
      columns={simpananWajibColumns}
      listUrl="/api/simpanan?jenis=wajib"
      createHref="/dashboard/simpanan/wajib/create"
      createLabel="Tambah Simpanan Wajib"
      onDeleteUrl={(id) => `/api/simpanan/${id}`}
      searchPlaceholder="Cari simpanan..."
      emptyText="Belum ada simpanan wajib"
    />
  );
}

