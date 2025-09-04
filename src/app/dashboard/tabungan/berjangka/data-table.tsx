'use client'

type Row = Record<string, unknown>;

export default function TabunganBerjangkaDataTable({ rows = [] as Row[] }: { rows?: Row[] }) {
  return (
    <div className="border rounded-md p-4">
      <div className="text-sm text-muted-foreground">Tabel tabungan berjangka (placeholder)</div>
      <pre className="text-xs mt-2 bg-muted/40 p-3 rounded-md overflow-auto">{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}

