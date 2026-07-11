import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function GET(req: Request) {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const reviews = await prisma.review.findMany({
            where: { project: { userId: user.userId } },
            include: { findings: true, project: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ reviews });
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { projectName, summary, metrics, chainOfThought, fullCode, findings } = body;

        // Create or find a project for this submission
        let project = await prisma.project.findFirst({
            where: { userId: user.userId, projectName }
        });

        if (!project) {
            project = await prisma.project.create({
                data: {
                    userId: user.userId,
                    projectName: projectName || "Untitled Snippet",
                }
            });
        }

        const review = await prisma.review.create({
            data: {
                projectId: project.id,
                summary,
                metrics: metrics ? JSON.stringify(metrics) : null,
                chainOfThought,
                fullCode,
                findings: {
                    create: findings.map((f: any) => ({
                        category: f.category,
                        severity: f.severity,
                        description: f.description,
                        suggestion: f.suggestion
                    }))
                }
            },
            include: { findings: true }
        });

        return NextResponse.json({ review });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
    }
}
