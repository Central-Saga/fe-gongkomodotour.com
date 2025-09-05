import TabunganHarianDataTable from './data-table';

export default function TabunganHarianPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Tabungan - Harian</h1>
        <p className="text-sm text-muted-foreground">Daftar tabungan harian dari backend.</p>
      </div>

      <TabunganHarianDataTable />
    </div>
  );
}

