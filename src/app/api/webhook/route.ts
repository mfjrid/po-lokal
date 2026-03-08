import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        console.log("Mayar Webhook received:", payload);

        // Payload structure from Mayar (as per docs/common practice)
        const { event, data } = payload;

        // Both payment.success and payment.received are common event names depending on API version
        if (event === "payment.success" || event === "payment.received") {
            // Coba ambil dari id_custom jika ada, kalau tidak ekstrak 6 karakter terakhir dari productDescription
            const shortId = data.productDescription?.match(/#([a-zA-Z0-9]+)/)?.[1];
            const explicitId = data.id_custom || data.customId;

            let order;

            if (explicitId) {
                order = await prisma.order.findUnique({ where: { id: String(explicitId) } });
            } else if (shortId) {
                order = await prisma.order.findFirst({
                    where: { id: { endsWith: shortId } }
                });
            }

            if (!order) {
                console.warn("No matching Order found in webhook payload:", data);
                return NextResponse.json({ message: "Order not found for this payment" }, { status: 404 });
            }

            if (order && order.status !== "paid") {
                await prisma.$transaction([
                    // Update Order Status
                    prisma.order.update({
                        where: { id: order.id },
                        data: {
                            status: "paid",
                            paidAt: new Date(),
                            paymentRef: data.id,
                        },
                    }),
                    // Update Product sold count
                    prisma.product.update({
                        where: { id: order.productId },
                        data: {
                            sold: { increment: order.quantity },
                        },
                    }),
                ]);

                console.log(`Order ${order.id} marked as PAID via Webhook`);
            }
        }

        return NextResponse.json({ message: "Webhook processed" });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ message: "Webhook error" }, { status: 500 });
    }
}
