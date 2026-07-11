import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-internship-project";

export async function signToken(payload: { userId: string; email: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch (e) {
        return null;
    }
}

export async function getUserFromSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;
    return verifyToken(token);
}
