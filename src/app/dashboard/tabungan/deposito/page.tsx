import TabunganDepositoDataTable from './data-table';

export default function TabunganDepositoPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Tabungan - Deposito</h1>
        <p className="text-sm text-muted-foreground">Daftar tabungan deposito dari backend.</p>
      </div>

      <TabunganDepositoDataTable />
    </div>
  );
}

