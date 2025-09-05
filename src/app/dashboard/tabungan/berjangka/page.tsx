import TabunganBerjangkaDataTable from './data-table';

export default function TabunganBerjangkaPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Tabungan - Berjangka</h1>
        <p className="text-sm text-muted-foreground">Daftar tabungan berjangka dari backend.</p>
      </div>

      <TabunganBerjangkaDataTable />
    </div>
  );
}

