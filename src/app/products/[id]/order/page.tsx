"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrderPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const buyerData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            address: formData.get("address"),
        };

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: params.id,
                    buyerData,
                    quantity,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal membuat pesanan");
            }

            if (data.paymentLink) {
                window.location.href = data.paymentLink;
            }
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Link href={`/products/${params.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Batal & Kembali
                </Link>

                <Card className="shadow-2xl border-none overflow-hidden">
                    <div className="bg-primary p-6 text-white text-center">
                        <ShoppingBag className="h-10 w-10 mx-auto mb-2 opacity-80" />
                        <CardTitle className="text-2xl font-bold">Form Pre-Order</CardTitle>
                        <p className="text-white/80 text-sm mt-1">Lengkapi data diri untuk melanjutkan pembayaran</p>
                    </div>

                    <form onSubmit={onSubmit}>
                        <CardContent className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 border-b pb-2">Data Pemesan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nama Lengkap</label>
                                        <Input name="name" placeholder="Contoh: Budi Santoso" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nomor WhatsApp</label>
                                        <Input name="phone" placeholder="Contoh: 08123456789" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email (Opsional)</label>
                                    <Input name="email" type="email" placeholder="budi@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Alamat Lengkap</label>
                                    <Input name="address" placeholder="Jln. Mawar No. 123, Jakarta" required />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="font-bold text-slate-900 border-b pb-2">Detail Pesanan</h3>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <span className="font-medium">Jumlah Pesanan</span>
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            -
                                        </Button>
                                        <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-8 bg-slate-50 border-t flex flex-col space-y-4">
                            <Button className="w-full h-14 text-lg font-bold rounded-xl" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    "Lanjut ke Pembayaran via Mayar"
                                )}
                            </Button>
                            <p className="text-xs text-center text-slate-500">
                                Dengan mengklik tombol di atas, Anda menyetujui syarat dan ketentuan pre-order produk ini.
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
