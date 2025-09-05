'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Simpanan } from '@/types/simpanan';
import { simpananBerjangkaColumns } from './columns';

export default function SimpananBerjangkaDataTable() {
  return (
    <StandardDataTable<Simpanan>
      columns={simpananBerjangkaColumns}
      listUrl="/api/simpanan?jenis=berjangka"
      createHref="/dashboard/simpanan/berjangka/create"
      createLabel="Tambah Simpanan Berjangka"
      onDeleteUrl={(id) => `/api/simpanan/${id}`}
      searchPlaceholder="Cari simpanan..."
      emptyText="Belum ada simpanan berjangka"
    />
  );
}

