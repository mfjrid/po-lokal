import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "dayjs";
import { Edit, Package } from "lucide-react";

export default async function ProductsPage() {
    const session = await auth();

    const products = await prisma.product.findMany({
        where: { sellerId: (session?.user as any).id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-sm ">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Produk</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Slot (Terjual/Kuota)</TableHead>
                                <TableHead>Batas Waktu</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        Belum ada produk. Klik "Produk Baru" untuk memulai.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-slate-100 p-2 rounded-lg">
                                                    <Package className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <span>{product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>Rp {product.price.toLocaleString("id-ID")}</TableCell>
                                        <TableCell>
                                            <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${(product.sold / product.quota) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500">{product.sold} / {product.quota}</span>
                                        </TableCell>
                                        <TableCell>{dayjs(product.expiredAt).format("DD MMM YYYY")}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.isActive ? "default" : "secondary"}>
                                                {product.isActive ? "Aktif" : "Nonaktif"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/products/${product.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
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
