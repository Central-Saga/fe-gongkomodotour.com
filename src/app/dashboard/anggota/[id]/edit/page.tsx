"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import type { Anggota } from "@/types/anggota";

type FormState = {
  nama: string;
  nik: string;
  alamat: string;
  tanggal_lahir: string;
  no_hp: string;
  status: number;
  tgl_gabung: string;
};

export default function AnggotaEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<Anggota | { data: Anggota }>("GET", `/api/anggota/${id}`);
        const data = (res as any)?.data ? (res as any).data : res;
        if (mounted && data) {
          setForm({
            nama: data.nama,
            nik: data.nik,
            alamat: data.alamat,
            tanggal_lahir: data.tanggal_lahir,
            no_hp: data.no_hp,
            status: data.status,
            tgl_gabung: data.tgl_gabung,
          });
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Gagal memuat data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError(null);
    setSaving(true);
    try {
      await apiRequest("PUT", `/api/anggota/${id}`, form);
      router.push("/dashboard/anggota");
    } catch (err: any) {
      setError(err?.message ?? "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => (f ? { ...f, [key]: val } : f));
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Anggota</h1>
          <p className="text-sm text-muted-foreground">Perbarui data anggota</p>
        </div>
      </div>

      {loading && <div className="text-muted-foreground">Memuat...</div>}
      {error && !loading && <div className="text-sm text-red-600">{error}</div>}
      {!loading && form && (
        <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
          <Field label="Nama" required>
            <input
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={form.nama}
              onChange={(e) => set("nama", e.target.value)}
              required
            />
          </Field>

          <Field label="NIK" required>
            <input
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={form.nik}
              onChange={(e) => set("nik", e.target.value)}
              required
            />
          </Field>

          <Field label="No. HP" required>
            <input
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={form.no_hp}
              onChange={(e) => set("no_hp", e.target.value)}
              required
            />
          </Field>

          <Field label="Alamat">
            <textarea
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={form.alamat}
              onChange={(e) => set("alamat", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Tanggal Lahir">
              <input
                type="date"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={form.tanggal_lahir}
                onChange={(e) => set("tanggal_lahir", e.target.value)}
              />
            </Field>
            <Field label="Tgl Gabung">
              <input
                type="date"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={form.tgl_gabung}
                onChange={(e) => set("tgl_gabung", e.target.value)}
              />
            </Field>
            <Field label="Status">
              <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={form.status}
                onChange={(e) => set("status", Number(e.target.value))}
              >
                <option value={1}>Aktif</option>
                <option value={0}>Non Aktif</option>
              </select>
            </Field>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</Button>
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/anggota')}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, children, required = false }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block space-y-1">
      <div className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-600">*</span>}
      </div>
      {children}
    </label>
  );
}
