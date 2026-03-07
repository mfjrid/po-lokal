import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const buyerCount = await prisma.buyer.count();

    console.log(`Users: ${userCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Buyers: ${buyerCount}`);

    if (userCount > 0 && productCount > 0 && buyerCount > 0) {
        console.log("Seeding verified successfully!");
    } else {
        console.log("Seeding failed or data is missing.");
    }
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
