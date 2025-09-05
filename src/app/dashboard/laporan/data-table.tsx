'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import { laporanColumns } from './columns';

type Laporan = {
  id: number;
  judul: string;
  tanggal: string;
  deskripsi?: string | null;
};

export default function LaporanDataTable() {
  return (
    <StandardDataTable<Laporan>
      columns={laporanColumns}
      listUrl="/api/laporan"
      createHref="/dashboard/laporan/create"
      createLabel="Tambah Laporan"
      onDeleteUrl={(id) => `/api/laporan/${id}`}
      searchPlaceholder="Cari laporan..."
      emptyText="Belum ada laporan"
    />
  );
}

