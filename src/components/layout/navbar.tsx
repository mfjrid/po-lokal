"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User as UserIcon, LogOut } from "lucide-react";

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        PreOrder<span className="text-primary">Lokal</span>
                    </span>
                </Link>

                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        Jelajahi
                    </Link>
                    {session ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                    <UserIcon className="h-4 w-4" />
                                    <span>Dashboard</span>
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => signOut()}
                                className="flex items-center space-x-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Keluar</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Masuk</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Mulai Berjualan</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
