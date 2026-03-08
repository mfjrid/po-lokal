import prisma from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ orderId: string }> }) {
    const { orderId } = await searchParams;

    if (!orderId) {
        redirect("/");
    }

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { product: true },
    });

    if (!order) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="container mx-auto px-4 py-20 flex flex-col items-center">
                <div className="w-full max-w-xl">
                    <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
                        <div className="bg-primary p-12 text-center text-white">
                            <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>
                            <h1 className="text-3xl font-black mb-2">Terima Kasih!</h1>
                            <p className="opacity-90">Pesanan Anda telah kami terima.</p>
                        </div>

                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                                        <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                                        Ringkasan Pesanan
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">ID Pesanan</span>
                                            <span className="font-mono font-medium">{order.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Produk</span>
                                            <span className="font-medium">{order.product.name} x {order.quantity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Total Pembayaran</span>
                                            <span className="font-black text-primary text-lg">Rp {order.totalPrice.toLocaleString("id-ID")}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-slate-200">
                                            <span className="text-slate-500">Status</span>
                                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-xs uppercase">
                                                {order.status === "paid" ? "Sudah Dibayar" : "Menunggu Konfirmasi"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center space-y-4">
                                    <p className="text-sm text-slate-500 px-8">
                                        Status pembayaran akan diperbarui secara otomatis dalam beberapa saat. Anda akan menerima notifikasi via WhatsApp/Email segera setelah pembayaran dikonfirmasi.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                        <Link href="/">
                                            <Button variant="outline" className="w-full sm:w-auto px-8 rounded-xl">
                                                Kembali Berbelanja
                                            </Button>
                                        </Link>
                                        <Link href={`https://wa.me/628123456789?text=Halo,%20saya%20sudah%20membeli%20${order.product.name}%20dengan%20ID%20${order.id}`}>
                                            <Button className="w-full sm:w-auto px-8 rounded-xl">
                                                Hubungi Penjual
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
