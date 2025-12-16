import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Initialize Perplexity API (uses OpenAI SDK)
const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY || "",
    baseURL: "https://api.perplexity.ai",
});

// Fetch all portfolio data from database for RAG context
async function getPortfolioContext() {
    try {
        // Fetch all data in parallel
        const [profile, projects, toolboxCategories, socialLinks, location] = await Promise.all([
            prisma.profile.findFirst({ where: { isActive: true } }),
            prisma.project.findMany({
                include: {
                    tags: {
                        include: { tag: true }
                    }
                }
            }),
            prisma.toolboxCategory.findMany({
                where: { isActive: true },
                include: {
                    items: {
                        where: { isActive: true },
                        orderBy: { order: 'asc' }
                    }
                },
                orderBy: { order: 'asc' }
            }),
            prisma.socialLink.findMany({ where: { isActive: true } }),
            prisma.location.findFirst({ where: { isActive: true } })
        ]);

        // Format projects for context
        const projectsContext = projects.map(p => ({
            title: p.title,
            description: p.description,
            tags: p.tags.map(pt => pt.tag.name).join(", "),
            link: p.link,
            github: p.github,
            featured: p.featured
        }));

        // Format toolbox for context
        const toolboxContext = toolboxCategories.map(cat => ({
            category: cat.name,
            skills: cat.items.map(item => item.name).join(", ")
        }));

        // Format social links
        const socialsContext = socialLinks.map(s => ({
            platform: s.name,
            username: s.username,
            url: s.url
        }));

        return {
            profile: profile ? {
                description: profile.description,
                resumeUrl: profile.resumeUrl
            } : null,
            projects: projectsContext,
            skills: toolboxContext,
            socialLinks: socialsContext,
            location: location ? {
                name: location.name,
                address: location.address
            } : null
        };
    } catch (error) {
        console.error("Error fetching portfolio context:", error);
        return null;
    }
}

// Create system prompt with RAG context
function createSystemPrompt(context: Awaited<ReturnType<typeof getPortfolioContext>>) {
    if (!context) {
        return `You are a virtual assistant for Gzaaa's portfolio, a Full Stack Developer. 
Answer visitor questions in a friendly and informative manner. 
If you don't know the answer, be honest about it.`;
    }

    const projectsList = context.projects.map((p, i) =>
        `${i + 1}. **${p.title}** - ${p.description} (Tech: ${p.tags})`
    ).join('\n');

    const skillsList = context.skills.map((s, i) =>
        `${i + 1}. **${s.category}**: ${s.skills}`
    ).join('\n');

    const socialsList = context.socialLinks.map((s, i) =>
        `${i + 1}. **${s.platform}** - ${s.username}`
    ).join('\n');

    return `You are a virtual assistant for Gzaaa's portfolio. Gzaaa (pronounced: Gaza) is a Full Stack Developer from Indonesia.

INFORMATION ABOUT GZAAA:

## About
${context.profile?.description || 'Full Stack Developer focused on web development.'}

## Projects
${projectsList || 'No projects available.'}

## Skills & Tools
${skillsList || 'React, Next.js, TypeScript, Node.js'}

## Social Media
${socialsList || 'Available on the Contact page'}

## Location
${context.location ? context.location.name : 'Indonesia'}

## Resume
${context.profile?.resumeUrl ? 'Available on the About page, click the Download Resume button' : 'Available on the About page'}

HOW TO RESPOND:
1. Always respond in English
2. Use natural and professional language, like talking to a friend
3. Avoid excessive emojis - use at most 1 emoji at the end if needed
4. When listing multiple items, use numbered lists (1, 2, 3...)
5. Use **bold** for project names or important things
6. Keep answers short and to the point, max 2-3 paragraphs
7. Don't be too formal or stiff

LIMITATIONS:
- Only answer based on the information above
- If you don't know, say you don't have that information
- For hire/collaborate inquiries, direct them to the Contact page
- You are an AI assistant, not a human`;
}

export async function POST(request: NextRequest) {
    try {
        // Check if API key exists
        if (!process.env.PERPLEXITY_API_KEY) {
            return NextResponse.json(
                { error: "Perplexity API key not configured" },
                { status: 500 }
            );
        }

        const { message, history } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Get portfolio context from database (RAG)
        const portfolioContext = await getPortfolioContext();
        const systemPrompt = createSystemPrompt(portfolioContext);

        // Build messages array for Perplexity
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: "system", content: systemPrompt }
        ];

        // Add chat history
        if (history && Array.isArray(history)) {
            for (const msg of history) {
                messages.push({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                });
            }
        }

        // Add current message
        messages.push({ role: "user", content: message });

        // Call Perplexity API
        const response = await perplexity.chat.completions.create({
            model: "sonar-pro",
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
        });

        const assistantMessage = response.choices[0]?.message?.content || "Maaf, saya tidak bisa memberikan jawaban saat ini.";

        return NextResponse.json({
            message: assistantMessage,
            success: true
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            {
                error: "Failed to process message",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
