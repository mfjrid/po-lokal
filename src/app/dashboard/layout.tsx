"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Settings,
    PlusCircle,
    ArrowLeft,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Produk Saya", href: "/dashboard/products", icon: Package },
    { name: "Pesanan Masuk", href: "/dashboard/orders", icon: ShoppingBag },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white lg:block">
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center px-6 border-b border-slate-100">
                        <Link href="/" className="flex items-center space-x-2">
                            <ShoppingBag className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold text-slate-900 tracking-tight">PO-Lokal</span>
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 py-6">
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t border-slate-100 p-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start space-x-3 border-none hover:bg-red-50 hover:text-red-600"
                            onClick={() => signOut()}
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sign Out</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-900">
                            {sidebarLinks.find(l => l.href === pathname)?.name || "Dashboard"}
                        </h2>
                    </div>
                    <Link href="/dashboard/products/new">
                        <Button className="rounded-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Produk Baru
                        </Button>
                    </Link>
                </header>

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
