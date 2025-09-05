'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Simpanan } from '@/types/simpanan';
import { simpananWajibUsahaColumns } from './columns';

export default function SimpananWajibUsahaDataTable() {
  return (
    <StandardDataTable<Simpanan>
      columns={simpananWajibUsahaColumns}
      listUrl="/api/simpanan?jenis=wajib_usaha"
      createHref="/dashboard/simpanan/wajib_usaha/create"
      createLabel="Tambah Simpanan Wajib Usaha"
      onDeleteUrl={(id) => `/api/simpanan/${id}`}
      searchPlaceholder="Cari simpanan..."
      emptyText="Belum ada simpanan wajib usaha"
    />
  );
}

