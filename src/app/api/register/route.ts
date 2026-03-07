import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, name, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const exists = await prisma.user.findUnique({
            where: { email },
        });

        if (exists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "User created successfully", user: { email: user.email } }, { status: 201 });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Error registering user" }, { status: 500 });
    }
}
