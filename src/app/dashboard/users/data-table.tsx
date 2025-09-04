'use client'

import type { User } from '@/types/users';

export default function UserDataTable({ rows = [] as User[] }: { rows?: User[] }) {
  return (
    <div className="border rounded-md p-4">
      <div className="text-sm text-muted-foreground">Tabel user (placeholder)</div>
      <pre className="text-xs mt-2 bg-muted/40 p-3 rounded-md overflow-auto">
        {JSON.stringify(rows, null, 2)}
      </pre>
    </div>
  );
}

