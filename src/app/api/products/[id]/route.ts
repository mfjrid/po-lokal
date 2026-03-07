import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { seller: { select: { name: true } } },
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { name, description, price, quota, expiredAt, imageUrl, isActive } = data;

        // Verify ownership
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        if (existingProduct.sellerId !== (session.user as any).id) {
            return NextResponse.json({ message: "Unauthorized to edit this product" }, { status: 403 });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                quota,
                expiredAt: expiredAt ? new Date(expiredAt) : undefined,
                imageUrl,
                isActive,
            },
        });

        return NextResponse.json({ message: "Product updated", product });
    } catch (error) {
        console.error("Product update error:", error);
        return NextResponse.json({ message: "Error updating product" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        if (existingProduct.sellerId !== (session.user as any).id) {
            return NextResponse.json({ message: "Unauthorized to delete this product" }, { status: 403 });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
    }
}
