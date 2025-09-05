'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Tabungan } from '@/types/tabungan';
import { tabunganBerjangkaColumns } from './columns';

export default function TabunganBerjangkaDataTable() {
  return (
    <StandardDataTable<Tabungan>
      columns={tabunganBerjangkaColumns}
      listUrl="/api/tabungan?jenis=berjangka"
      createHref="/dashboard/tabungan/berjangka/create"
      createLabel="Tambah Tabungan Berjangka"
      searchPlaceholder="Cari tabungan..."
      emptyText="Belum ada tabungan berjangka"
    />
  );
}

