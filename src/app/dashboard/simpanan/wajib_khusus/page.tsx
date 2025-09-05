import SimpananWajibKhususDataTable from './data-table';

export default function SimpananWajibKhususPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Simpanan - Wajib Khusus</h1>
        <p className="text-sm text-muted-foreground">Daftar simpanan wajib khusus dari backend.</p>
      </div>

      <SimpananWajibKhususDataTable />
    </div>
  );
}

