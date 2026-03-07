import prisma from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Users, ShoppingCart, ArrowLeft, ShieldCheck } from "lucide-react";
import dayjs from "dayjs";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: { seller: { select: { name: true } } },
    });

    if (!product) {
        notFound();
    }

    const remaining = product.quota - product.sold;
    const isExpired = dayjs().isAfter(dayjs(product.expiredAt));
    const progress = (product.sold / product.quota) * 100;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Jelajah
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-lg">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-400 font-medium">
                                    No Image Available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="text-sm font-bold uppercase tracking-widest text-primary mb-2 block">
                                {product.seller.name || "Penjual Lokal"}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4 mb-8">
                            <span className="text-3xl font-black text-slate-900">
                                Rp {product.price.toLocaleString("id-ID")}
                            </span>
                            <Badge variant={isExpired ? "destructive" : "secondary"} className="h-6">
                                {isExpired ? "Pre-Order Selesai" : "Buka Pre-Order"}
                            </Badge>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                            <div className="flex justify-between items-center mb-4 text-sm font-medium">
                                <span className="text-slate-600">Progres Pre-Order</span>
                                <span className="text-primary">{Math.round(progress)}% ({product.sold}/{product.quota})</span>
                            </div>
                            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>Sampai: {dayjs(product.expiredAt).format("DD MMMM YYYY")}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span>{remaining} Slot Tersisa</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none mb-10">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Deskripsi Produk</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100 mb-4">
                                <ShieldCheck className="h-5 w-5 text-green-600 mr-3" />
                                <span className="text-sm text-green-700 font-medium">Pembayaran Aman via Mayar Gateway</span>
                            </div>

                            <Link href={`/products/${product.id}/order`} className="block">
                                <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg" disabled={isExpired || remaining <= 0}>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Pre-Order Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
