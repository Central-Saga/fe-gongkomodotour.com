import SimpananWajibDataTable from './data-table';

export default function SimpananWajibPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Simpanan - Wajib</h1>
        <p className="text-sm text-muted-foreground">Daftar simpanan wajib dari backend.</p>
      </div>

      <SimpananWajibDataTable />
    </div>
  );
}

