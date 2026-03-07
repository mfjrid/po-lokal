import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Hash password for dummy user
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedSellerPassword = await bcrypt.hash("seller123", 10);

    // 1. Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: "admin@preorderlokal.com" },
        update: {},
        create: {
            email: "admin@preorderlokal.com",
            name: "Admin Lokal",
            password: hashedAdminPassword,
            role: "admin",
            phone: "08123456789",
        },
    });

    // 2. Create Seller User
    const seller = await prisma.user.upsert({
        where: { email: "toko.madu@example.com" },
        update: {},
        create: {
            email: "toko.madu@example.com",
            name: "Toko Madu Asli",
            password: hashedSellerPassword,
            role: "seller",
            phone: "08987654321",
        },
    });

    // 3. Create Buyer
    const buyer = await prisma.buyer.create({
        data: {
            name: "Budi Pembeli",
            email: "budi@pembeli.com",
            phone: "081122334455",
            address: "Jl. Merdeka No. 10, Jakarta",
        },
    });

    // 4. Create Product for Seller
    const product = await prisma.product.create({
        data: {
            sellerId: seller.id,
            name: "Madu Hutan Luwu 500ml",
            description: "Madu hutan asli dari daerah Luwu, Sulawesi Selatan. Terbatas!",
            price: 150000,
            quota: 20,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            isActive: true,
        },
    });

    console.log({ admin, seller, buyer, product });
    console.log("Seeding finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
