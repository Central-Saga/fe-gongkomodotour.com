'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Simpanan } from '@/types/simpanan';
import { simpananKhususColumns } from './columns';

export default function SimpananKhususDataTable() {
  return (
    <StandardDataTable<Simpanan>
      columns={simpananKhususColumns}
      listUrl="/api/simpanan?jenis=khusus"
      createHref="/dashboard/simpanan/khusus/create"
      createLabel="Tambah Simpanan Khusus"
      onDeleteUrl={(id) => `/api/simpanan/${id}`}
      searchPlaceholder="Cari simpanan..."
      emptyText="Belum ada simpanan khusus"
    />
  );
}

