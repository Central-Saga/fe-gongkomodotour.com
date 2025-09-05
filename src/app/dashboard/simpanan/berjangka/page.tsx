import SimpananBerjangkaDataTable from './data-table';

export default function SimpananBerjangkaPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Simpanan - Berjangka</h1>
        <p className="text-sm text-muted-foreground">Daftar simpanan berjangka dari backend.</p>
      </div>

      <SimpananBerjangkaDataTable />
    </div>
  );
}

