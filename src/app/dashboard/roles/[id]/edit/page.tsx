"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
import type { Role } from '@/types/role';

export default function RolesEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<Role | { data: Role }>('GET', `/api/roles/${id}`);
        const data = (res as any)?.data ? (res as any).data : res;
        if (mounted && data) setName((data as Role).name);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Gagal memuat data');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (id) load();
    return () => { mounted = false; };
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await apiRequest('PUT', `/api/roles/${id}`, { name });
      router.push('/dashboard/roles');
    } catch (err: any) {
      setError(err?.message ?? 'Gagal menyimpan role');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Edit Role</h1>
        <p className="text-sm text-muted-foreground">Perbarui nama role</p>
      </div>

      {loading && <div className="text-muted-foreground">Memuat...</div>}
      {error && !loading && <div className="text-sm text-red-600">{error}</div>}
      {!loading && (
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
          <label className="block space-y-1">
            <div className="text-sm font-medium text-foreground">Nama Role<span className="text-red-600">*</span></div>
            <input
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/roles')}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}

