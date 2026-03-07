import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();

    const stats = await prisma.$transaction([
        prisma.product.count({ where: { sellerId: (session?.user as any).id } }),
        prisma.order.count({
            where: {
                product: { sellerId: (session?.user as any).id },
                status: "paid"
            }
        }),
        prisma.order.aggregate({
            where: {
                product: { sellerId: (session?.user as any).id },
                status: "paid"
            },
            _sum: { totalPrice: true }
        })
    ]);

    const cards = [
        { title: "Total Produk", value: stats[0], icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Pesanan Sukses", value: stats[1], icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
        { title: "Total Pendapatan", value: `Rp ${(stats[2]._sum.totalPrice || 0).toLocaleString("id-ID")}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Card key={card.title} className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">{card.title}</CardTitle>
                            <div className={`${card.bg} p-2 rounded-lg`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900">{card.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity or Placeholder */}
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Ringkasan Performa</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-slate-400">
                    <p>Statistik visual akan muncul di sini setelah ada transaksi.</p>
                </CardContent>
            </Card>
        </div>
    );
}
