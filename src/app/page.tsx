import prisma from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { seller: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Dukung UMKM Lokal dengan <span className="text-primary italic">Pre-Order</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Platform marketplace khusus produk pre-order terbatas dari UMKM terbaik di sekitar Anda.
              Dapatkan produk eksklusif dan bantu ekonomi lokal tumbuh.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                Jelajahi Produk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/register">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  Mulai Berjualan
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-30" />
      </section>

      {/* Product Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Pre-Order Terbaru</h2>
              <p className="text-slate-500 mt-2">Produk-produk pilihan yang sedang buka kuota</p>
            </div>
            <Button variant="ghost" className="text-primary font-semibold">
              Lihat Semua
            </Button>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Belum ada produk</h3>
              <p className="text-slate-500 mt-2">Jadilah yang pertama untuk membuat produk pre-order!</p>
              <Link href="/register" className="mt-8 inline-block">
                <Button>Mulai Berjualan Sekarang</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 PreOrderLokal. Dibuat untuk Lomba Mayar.
          </p>
        </div>
      </footer>
    </div>
  );
}
