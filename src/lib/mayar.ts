import axios from "axios";

const MAYAR_API_KEY = process.env.MAYAR_API_KEY;
const MAYAR_BASE_URL = process.env.MAYAR_BASE_URL || "https://api.mayar.club/hl/v1";

const mayarClient = axios.create({
    baseURL: MAYAR_BASE_URL,
    headers: {
        Authorization: `Bearer ${MAYAR_API_KEY}`,
        "Content-Type": "application/json",
    },
});

export async function createPaymentLink(payload: {
    name: string;
    amount: number;
    description: string;
    redirectUrl: string;
    mobile?: string;
    email?: string;
    orderId?: string;
}) {
    try {
        const response = await mayarClient.post("/payment/create", {
            name: payload.name,
            amount: payload.amount,
            description: payload.description,
            redirectURL: payload.redirectUrl,
            mobile: payload.mobile,
            email: payload.email,
            id_custom: payload.orderId,
        });

        return response.data;
    } catch (error: any) {
        console.error("Mayar API Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Gagal menghubungi Mayar API");
    }
}
