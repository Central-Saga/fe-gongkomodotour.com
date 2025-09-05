import SimpananKhususDataTable from './data-table';

export default function SimpananKhususPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Simpanan - Khusus</h1>
        <p className="text-sm text-muted-foreground">Daftar simpanan khusus dari backend.</p>
      </div>

      <SimpananKhususDataTable />
    </div>
  );
}

