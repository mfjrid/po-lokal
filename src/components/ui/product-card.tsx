"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import dayjs from "dayjs";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string | null;
        quota: number;
        sold: number;
        expiredAt: Date;
        seller: {
            name: string | null;
        };
    };
}

export function ProductCard({ product }: ProductCardProps) {
    const remaining = product.quota - product.sold;
    const isExpired = dayjs().isAfter(dayjs(product.expiredAt));

    return (
        <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow group">
            <div className="relative aspect-square overflow-hidden bg-slate-100">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 font-medium">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    {isExpired ? (
                        <Badge variant="destructive">Berakhir</Badge>
                    ) : remaining <= 5 ? (
                        <Badge variant="warning">Sisa {remaining}!</Badge>
                    ) : (
                        <Badge variant="secondary">Tersedia</Badge>
                    )}
                </div>
            </div>
            <CardContent className="p-4 space-y-2">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {product.seller.name || "Penjual Lokal"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                        {product.name}
                    </h3>
                </div>
                <p className="text-xl font-black text-slate-900">
                    Rp {product.price.toLocaleString("id-ID")}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-50">
                    <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{product.sold} Terpesan</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{dayjs(product.expiredAt).format("DD MMM")}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Link href={`/products/${product.id}`} className="w-full">
                    <Button className="w-full" variant={isExpired ? "secondary" : "primary"} disabled={isExpired}>
                        {isExpired ? "Pre-Order Berakhir" : "Lihat Detail"}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
