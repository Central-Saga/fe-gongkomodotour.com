'use client'

import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import type { Anggota } from '@/types/anggota';
import { anggotaColumns } from './columns';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';

type ApiList<T> = { data: T } | T;

export default function AnggotaDataTable() {
  const [data, setData] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageSize, setPageSize] = useState(10);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<ApiList<Anggota[]>>('GET', '/api/anggota');
        const payload = Array.isArray(res) ? res : res.data;
        if (mounted) setData(payload ?? []);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Gagal memuat data');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const columns = useMemo<ColumnDef<Anggota>[]>(() => anggotaColumns, []);

  async function handleDelete(id: number) {
    if (!confirm('Yakin menghapus anggota ini?')) return;
    setDeletingId(id);
    try {
      await apiRequest('DELETE', `/api/anggota/${id}`);
      setData((rows) => rows.filter((r) => r.id !== id));
    } catch (e: any) {
      alert(e?.message ?? 'Gagal menghapus');
    } finally {
      setDeletingId(null);
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
    meta: { onDelete: handleDelete },
  });

  // keep table pageSize in sync with local control
  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Cari..."
          className="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />

        <div className="ml-auto flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}/hal</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
          <div className="text-sm w-[70px] text-center">{table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}</div>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className={`px-3 py-2 font-medium ${h.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === 'asc' && <span className="ml-1 text-xs opacity-70">▲</span>}
                    {h.column.getIsSorted() === 'desc' && <span className="ml-1 text-xs opacity-70">▼</span>}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-3 py-6 text-center text-muted-foreground">Memuat data...</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-3 py-6 text-center text-red-600">{error}</td>
              </tr>
            )}
            {!loading && !error && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-3 py-6 text-center text-muted-foreground">Tidak ada data</td>
              </tr>
            )}
            {!loading && !error && table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deletingId !== null && (
        <div className="text-xs text-muted-foreground">Menghapus ID: {deletingId}...</div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="text-sm font-medium">Kolom:</div>
        {table.getAllLeafColumns().map((col) => (
          <label key={col.id} className="text-xs flex items-center gap-1">
            <input
              type="checkbox"
              checked={col.getIsVisible()}
              onChange={col.getToggleVisibilityHandler()}
            />
            {col.columnDef.header as string}
          </label>
        ))}
      </div>
    </div>
  );
}
