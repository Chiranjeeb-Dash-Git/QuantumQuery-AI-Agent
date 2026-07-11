import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }
        
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signToken({ userId: user.id, email: user.email });
        
        const cookieStore = await cookies();
        cookieStore.set("auth-token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });

        return NextResponse.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
}
