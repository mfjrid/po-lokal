"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (searchParams.get("registered")) {
            setSuccess("Registrasi berhasil! Silakan masuk.");
        }
    }, [searchParams]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error("Email atau password salah");
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md shadow-lg border-none">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold text-primary">PreOrderLokal</CardTitle>
                <CardDescription>
                    Masuk ke akun penjual Anda untuk mengelola produk.
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    {success && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-100">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100 italic">
                            {error}
                        </div>
                    )}
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
                        Masuk
                    </Button>
                    <p className="text-sm text-center text-slate-500">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Daftar
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
            <Suspense fallback={
                <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
