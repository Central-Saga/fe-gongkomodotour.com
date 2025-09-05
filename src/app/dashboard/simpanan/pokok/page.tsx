import SimpananPokokDataTable from './data-table';

export default function SimpananPokokPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Simpanan - Pokok</h1>
        <p className="text-sm text-muted-foreground">Daftar simpanan pokok dari backend.</p>
      </div>

      <SimpananPokokDataTable />
    </div>
  );
}

