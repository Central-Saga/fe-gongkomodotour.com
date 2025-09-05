"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react"; // ⬅️ tambahkan useEffect
import {
  LayoutDashboard,
  Wallet,
  BookMarked,
  FileText,
  Users,
  BadgeCheck,
  UserPlus,
  ChevronDown,
} from "lucide-react";

type Item = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: Item[];
};

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  // Match full segment to avoid '/wajib' matching '/wajib_usaha'
  return pathname === href || pathname.startsWith(href + "/");
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  const menu = useMemo<Item[]>(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Simpanan",
        icon: Wallet,
        children: [
          { label: "Sukarela", href: "/dashboard/simpanan/sukarela" },
          { label: "Wajib usaha", href: "/dashboard/simpanan/wajib_usaha" },
          { label: "Berjangka", href: "/dashboard/simpanan/berjangka" },
          { label: "Pokok", href: "/dashboard/simpanan/pokok" },
          { label: "Wajib", href: "/dashboard/simpanan/wajib" },
          { label: "Wajib Khusus", href: "/dashboard/simpanan/wajib_khusus" },
          { label: "Khusus", href: "/dashboard/simpanan/khusus" },
          { label: "Modal", href: "/dashboard/simpanan/modal" },
        ],
      },
      {
        label: "Tabungan",
        icon: BookMarked,
        children: [
          { label: "Harian", href: "/dashboard/tabungan/harian" },
          { label: "Berjangka", href: "/dashboard/tabungan/berjangka" },
          { label: "Deposito", href: "/dashboard/tabungan/deposito" },
        ],
      },
      { label: "Laporan", href: "/dashboard/laporan", icon: FileText },
    ],
    []
  );

  const admin = useMemo<Item[]>(
    () => [
      { label: "Users", href: "/dashboard/users", icon: Users },
      { label: "Roles", href: "/dashboard/roles", icon: BadgeCheck },
      { label: "Anggota", href: "/dashboard/anggota", icon: UserPlus },
    ],
    []
  );

  // ⬇️ Tutup semua grup di awal, tapi buka otomatis kalau ada child yang aktif
  const initialOpen = useMemo(() => {
    const state: Record<string, boolean> = {};
    for (const item of menu) {
      if (item.children) {
        state[item.label] = item.children.some((c) => isActive(pathname, c.href)) || false;
      }
    }
    return state;
  }, [menu, pathname]);

  const [open, setOpen] = useState<Record<string, boolean>>(initialOpen);

  // ⬇️ Saat route berubah, pastikan grup yang aktif otomatis terbuka (tanpa memaksa grup lain menutup)
  useEffect(() => {
    setOpen((o) => {
      const next = { ...o };
      for (const item of menu) {
        if (item.children && item.children.some((c) => isActive(pathname, c.href))) {
          next[item.label] = true;
        }
      }
      return next;
    });
  }, [pathname, menu]);

  return (
    <aside className="h-screen sticky top-0 w-[248px] shrink-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 flex flex-col gap-6">
        <div className="flex items-center justify-center pt-2">
          <Image src="/logo_koperasi.png" alt="logo koperasi" width={128} height={128} className="rounded" />
        </div>

        <nav className="flex flex-col gap-6">
          <div>
            <div className="px-3 pb-2 text-xs font-medium tracking-wide text-muted-foreground">Menu</div>
            <ul className="space-y-1">
              {menu.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <Collapsible
                      label={item.label}
                      icon={item.icon}
                      active={item.children.some((c) => isActive(pathname, c.href))}
                      open={open[item.label]}
                      onToggle={() => setOpen((o) => ({ ...o, [item.label]: !o[item.label] }))}
                    >
                      {item.children.map((c) => (
                        <SidebarLink key={c.label} href={c.href!} active={isActive(pathname, c.href)}>
                          {c.label}
                        </SidebarLink>
                      ))}
                    </Collapsible>
                  ) : (
                    <SidebarItem href={item.href!} icon={item.icon} active={isActive(pathname, item.href)}>
                      {item.label}
                    </SidebarItem>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="px-3 pb-2 text-xs font-medium tracking-wide text-muted-foreground">Admin</div>
            <ul className="space-y-1">
              {admin.map((item) => (
                <li key={item.label}>
                  <SidebarItem href={item.href!} icon={item.icon} active={isActive(pathname, item.href)}>
                    {item.label}
                  </SidebarItem>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}

function SidebarItem({
  href,
  icon: Icon,
  active,
  children,
}: {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "mx-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors " +
        (active ? "bg-emerald-400/70 text-emerald-950 hover:bg-emerald-400" : "hover:bg-muted text-foreground")
      }
    >
      {Icon ? <Icon className="size-4" /> : null}
      <span className="font-medium">{children}</span>
    </Link>
  );
}

function Collapsible({
  label,
  icon: Icon,
  active,
  open,
  onToggle,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-2">
      <button
        type="button"
        onClick={onToggle}
        className={
          "w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors " +
          (active ? "bg-emerald-400/70 text-emerald-950 hover:bg-emerald-400" : "hover:bg-muted text-foreground")
        }
        aria-expanded={open}
        aria-controls={`section-${label}`}
      >
        <span className="flex items-center gap-3">
          {Icon ? <Icon className="size-4" /> : null}
          <span className="font-medium">{label}</span>
        </span>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && (
        <div id={`section-${label}`} className="mt-1 rounded-xl border bg-background shadow-sm">
          <div className="p-2 space-y-1">{children}</div>
        </div>
      )}
    </div>
  );
}

function SidebarLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={
        "block rounded-lg px-3 py-2 text-sm transition-colors " +
        (active ? "bg-emerald-100 text-emerald-900" : "hover:bg-muted text-foreground")
      }
    >
      {children}
    </Link>
  );
}
