"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';

export default function RolesCreatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await apiRequest('POST', '/api/roles', { name });
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
        <h1 className="text-2xl font-semibold">Buat Role</h1>
        <p className="text-sm text-muted-foreground">Tambahkan role baru</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
        {error && <div className="text-sm text-red-600">{error}</div>}
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
          <Button type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard/roles')}>Batal</Button>
        </div>
      </form>
    </div>
  );
}

