import SimpananSukarelaDataTable from './data-table';

export default function SimpananSukarelaPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Simpanan - Sukarela</h1>
        <p className="text-sm text-muted-foreground">Daftar simpanan sukarela dari backend.</p>
      </div>

      <SimpananSukarelaDataTable />
    </div>
  );
}

