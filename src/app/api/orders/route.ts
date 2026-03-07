import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createPaymentLink } from "@/lib/mayar";

export async function POST(req: Request) {
    try {
        const { productId, buyerData, quantity } = await req.json();

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
        }

        const remaining = product.quota - product.sold;
        if (quantity > remaining) {
            return NextResponse.json({ message: `Stok tidak mencukupi (Tersisa: ${remaining})` }, { status: 400 });
        }

        const totalPrice = product.price * quantity;

        // 1. Create or Update Buyer
        const buyer = await prisma.buyer.upsert({
            where: { id: buyerData.phone }, // Use phone as unique ID for simplicity in this demo
            update: {
                name: buyerData.name,
                email: buyerData.email,
                address: buyerData.address,
            },
            create: {
                id: buyerData.phone,
                name: buyerData.name,
                email: buyerData.email,
                phone: buyerData.phone,
                address: buyerData.address,
            },
        });

        // 2. Create Order (Status: Pending)
        const order = await prisma.order.create({
            data: {
                productId: product.id,
                buyerId: buyer.id,
                quantity,
                totalPrice,
                status: "pending",
            },
        });

        // 3. Create Payment Link via Mayar
        const paymentData = await createPaymentLink({
            name: `Pre-Order ${product.name}`,
            amount: totalPrice,
            description: `Pesanan #${order.id.slice(-6)} - ${product.name} x ${quantity}`,
            redirectUrl: `${process.env.NEXTAUTH_URL}/success?orderId=${order.id}`,
            mobile: buyer.phone,
            email: buyer.email || undefined,
            orderId: order.id,
        });

        // 4. Update order with payment details
        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentLink: paymentData.data.link,
            },
        });

        return NextResponse.json({
            message: "Order created",
            orderId: order.id,
            paymentLink: paymentData.data.link,
        });

    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ message: error.message || "Gagal membuat pesanan" }, { status: 500 });
    }
}
