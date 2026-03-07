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
            // We use id_custom as the primary identifier because we set it in the order creation
            const orderId = data.id_custom || data.description?.match(/#([a-zA-Z0-9]+)/)?.[1];

            if (!orderId) {
                console.warn("No Order ID found in webhook payload:", data.id);
                return NextResponse.json({ message: "Order ID not found" }, { status: 400 });
            }

            const order = await prisma.order.findUnique({
                where: { id: orderId },
            });

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
