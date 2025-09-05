import UserDataTable from './data-table';

export default function UserPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">Daftar user dari backend.</p>
      </div>

      <UserDataTable />
    </div>
  );
}

