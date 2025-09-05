'use client';

import StandardDataTable from '@/components/data/standard-data-table';
import type { Tabungan } from '@/types/tabungan';
import { tabunganDepositoColumns } from './columns';

export default function TabunganDepositoDataTable() {
  return (
    <StandardDataTable<Tabungan>
      columns={tabunganDepositoColumns}
      listUrl="/api/tabungan?jenis=deposito"
      createHref="/dashboard/tabungan/deposito/create"
      createLabel="Tambah Tabungan Deposito"
      searchPlaceholder="Cari tabungan..."
      emptyText="Belum ada tabungan deposito"
    />
  );
}

