import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, description, price, quota, expiredAt, imageUrl } = await req.json();

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                quota,
                expiredAt: new Date(expiredAt),
                imageUrl,
                sellerId: (session.user as any).id,
            },
        });

        return NextResponse.json({ message: "Product created", product }, { status: 201 });
    } catch (error: any) {
        console.error("Product creation error:", error);
        return NextResponse.json({ message: "Error creating product" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            include: { seller: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}
