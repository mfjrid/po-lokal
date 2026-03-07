"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const name = formData.get("name");
        const password = formData.get("password");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Something went wrong");
            }

            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-primary">PreOrderLokal</CardTitle>
                    <CardDescription>
                        Daftar sebagai penjual untuk mulai berjualan produk pre-order.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100 italic">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nama Lengkap</label>
                            <Input name="name" placeholder="Budi Santoso" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input name="email" type="email" placeholder="budi@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input name="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Daftar Sekarang
                        </Button>
                        <p className="text-sm text-center text-slate-500">
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Masuk
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
