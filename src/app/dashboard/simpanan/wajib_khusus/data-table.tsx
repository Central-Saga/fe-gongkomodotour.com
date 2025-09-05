'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Simpanan } from '@/types/simpanan';
import { simpananWajibKhususColumns } from './columns';

export default function SimpananWajibKhususDataTable() {
  return (
    <StandardDataTable<Simpanan>
      columns={simpananWajibKhususColumns}
      listUrl="/api/simpanan?jenis=wajib_khusus"
      createHref="/dashboard/simpanan/wajib_khusus/create"
      createLabel="Tambah Simpanan Wajib Khusus"
      onDeleteUrl={(id) => `/api/simpanan/${id}`}
      searchPlaceholder="Cari simpanan..."
      emptyText="Belum ada simpanan wajib khusus"
    />
  );
}

