"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Wallet, BookMarked } from "lucide-react";

type Summary = {
  anggota_count?: number;
  users_count?: number;
  simpanan_total?: number;
  tabungan_total?: number;
  latest_activities?: Array<{ id: number; title: string; time: string }>;
};

export default function DashboardHome() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await apiRequest<Summary | { data: Summary }>("GET", "/api/dashboard/summary").catch(() => null);
        const data = (res as any)?.data ? (res as any).data : res;
        if (mounted) setSummary(data ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const currency = (n?: number) => (typeof n === "number" ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n) : "-");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan koperasi Partha Manunggal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Users className="size-4" />} title="Anggota" value={loading ? "-" : String(summary?.anggota_count ?? "-")} href="/dashboard/anggota" />
        <StatCard icon={<Users className="size-4" />} title="Users" value={loading ? "-" : String(summary?.users_count ?? "-")} href="/dashboard/users" />
        <StatCard icon={<Wallet className="size-4" />} title="Total Simpanan" value={loading ? "-" : currency(summary?.simpanan_total)} href="/dashboard/simpanan/wajib" />
        <StatCard icon={<BookMarked className="size-4" />} title="Total Tabungan" value={loading ? "-" : currency(summary?.tabungan_total)} href="/dashboard/tabungan/harian" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Aktivitas Terbaru</div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/laporan">Lihat Semua</Link>
              </Button>
            </div>
            {loading && <div className="text-sm text-muted-foreground">Memuat...</div>}
            {!loading && (!summary?.latest_activities || summary.latest_activities.length === 0) && (
              <div className="text-sm text-muted-foreground">Belum ada data.</div>
            )}
            {!loading && summary?.latest_activities && summary.latest_activities.length > 0 && (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Waktu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.latest_activities.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{a.title}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(a.time).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Akses Cepat</div>
              <Badge variant="secondary">Shortcut</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Button asChild variant="outline"><Link href="/dashboard/anggota">Anggota</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/simpanan/wajib">Simpanan</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/tabungan/harian">Tabungan</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/laporan">Laporan</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/users">Users</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/roles">Roles</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: string; href: string }) {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {icon}
            <span>{title}</span>
          </div>
          <Button asChild size="sm" variant="outline"><Link href={href}>Detail</Link></Button>
        </div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

