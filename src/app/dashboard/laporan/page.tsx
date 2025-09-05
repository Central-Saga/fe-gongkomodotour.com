import LaporanDataTable from './data-table';

export default function LaporanPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Laporan</h1>
        <p className="text-sm text-muted-foreground">Daftar laporan dari backend.</p>
      </div>

      <LaporanDataTable />
    </div>
  );
}

