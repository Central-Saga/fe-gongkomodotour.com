import SimpananWajibUsahaDataTable from './data-table';

export default function SimpananWajibUsahaPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Simpanan - Wajib Usaha</h1>
        <p className="text-sm text-muted-foreground">Daftar simpanan wajib usaha dari backend.</p>
      </div>

      <SimpananWajibUsahaDataTable />
    </div>
  );
}

