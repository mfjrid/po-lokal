import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { ShoppingBag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function DashboardOrdersPage() {
    const session = await auth();

    const orders = await prisma.order.findMany({
        where: {
            product: { sellerId: (session?.user as any).id }
        },
        include: {
            product: true,
            buyer: true
        },
        orderBy: { createdAt: "desc" },
    });

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "paid": return "default";
            case "pending": return "warning";
            case "failed": return "destructive";
            default: return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <Input placeholder="Cari pesanan atau nama pembeli..." className="pl-10" />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>ID Pesanan</TableHead>
                                <TableHead>Pembeli</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Jumlah</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tanggal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center text-slate-500">
                                        <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                        Belum ada pesanan masuk.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs uppercase text-slate-500">
                                            #{order.id.slice(-8)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{order.buyer?.name}</span>
                                                <span className="text-xs text-slate-500">{order.buyer?.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate">{order.product.name}</TableCell>
                                        <TableCell className="text-center font-bold">{order.quantity}</TableCell>
                                        <TableCell className="font-bold text-slate-900">
                                            Rp {order.totalPrice.toLocaleString("id-ID")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(order.status)}>
                                                {order.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-xs text-nowrap">
                                            {dayjs(order.createdAt).format("DD MMM, HH:mm")}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
