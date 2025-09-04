'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Anggota } from '@/types/anggota';
import { apiRequest } from '@/lib/api';

export default function AnggotaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [data, setData] = useState<Anggota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<Anggota | { data: Anggota }>('GET', `/api/anggota/${id}`);
        const payload = (res as any)?.data ? (res as any).data : res;
        if (mounted) setData(payload ?? null);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Gagal memuat detail');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Detail Anggota</h1>
          <p className="text-sm text-muted-foreground">Informasi lengkap anggota</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>Kembali</Button>
          {data?.id && (
            <Button asChild>
              <Link href={`/dashboard/anggota/${data.id}/edit`}>Edit</Link>
            </Button>
          )}
        </div>
      </div>

      {loading && <div className="text-muted-foreground">Memuat...</div>}
      {error && !loading && <div className="text-red-600">{error}</div>}
      {!loading && !error && data && (
        <div className="rounded-md border divide-y">
          <Row label="ID" value={String(data.id)} />
          <Row label="NIK" value={data.nik} />
          <Row label="Nama" value={data.nama} />
          <Row label="No. HP" value={data.no_hp} />
          <Row label="Alamat" value={data.alamat} />
          <Row label="Tanggal Lahir" value={data.tanggal_lahir} />
          <Row label="Tgl Gabung" value={data.tgl_gabung} />
          <Row label="Status" value={String(data.status)} />
          <Row label="Dibuat" value={data.created_at} />
          <Row label="Diupdate" value={data.updated_at} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3">
      <div className="w-40 text-sm text-muted-foreground">{label}</div>
      <div className="text-sm">{value ?? '-'}</div>
    </div>
  );
}

