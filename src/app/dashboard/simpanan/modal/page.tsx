import SimpananModalDataTable from './data-table';

export default function SimpananModalPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Simpanan - Modal</h1>
        <p className="text-sm text-muted-foreground">Daftar simpanan modal dari backend.</p>
      </div>

      <SimpananModalDataTable />
    </div>
  );
}

