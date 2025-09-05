'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Tabungan } from '@/types/tabungan';
import { tabunganHarianColumns } from './columns';

export default function TabunganHarianDataTable() {
  return (
    <StandardDataTable<Tabungan>
      columns={tabunganHarianColumns}
      listUrl="/api/tabungan?jenis=harian"
      createHref="/dashboard/tabungan/harian/create"
      createLabel="Tambah Tabungan Harian"
      searchPlaceholder="Cari tabungan..."
      emptyText="Belum ada tabungan harian"
    />
  );
}

