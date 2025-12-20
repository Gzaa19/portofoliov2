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
        const [profile, projects, toolboxCategories, socialLinks, location, experiences, educations] = await Promise.all([
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
            prisma.location.findFirst({ where: { isActive: true } }),
            prisma.experience.findMany({
                where: { isActive: true },
                orderBy: { startDate: 'desc' }
            }),
            prisma.education.findMany({
                where: { isActive: true },
                orderBy: { startDate: 'desc' }
            })
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

        // Format experiences for context
        const experiencesContext = experiences.map(exp => ({
            company: exp.companyName,
            title: exp.title,
            employmentType: exp.employmentType,
            location: exp.location,
            locationType: exp.locationType,
            startDate: exp.startDate,
            endDate: exp.endDate,
            isCurrent: exp.isCurrent,
            description: exp.description
        }));

        // Format educations for context
        const educationsContext = educations.map(edu => ({
            school: edu.school,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            isCurrent: edu.isCurrent,
            grade: edu.grade,
            activities: edu.activities,
            description: edu.description
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
            } : null,
            experiences: experiencesContext,
            educations: educationsContext
        };
    } catch (error) {
        console.error("Error fetching portfolio context:", error);
        return null;
    }
}

// Create system prompt with RAG context
function createSystemPrompt(context: Awaited<ReturnType<typeof getPortfolioContext>>) {
    if (!context) {
        return `You are a virtual assistant for Gaza Al Ghozali Chansa portfolio, a Full Stack Developer. 
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

    // Format work experience
    const formatEmploymentType = (type: string) => {
        const types: Record<string, string> = {
            'full_time': 'Full-time',
            'part_time': 'Part-time',
            'self_employed': 'Self-employed',
            'freelance': 'Freelance',
            'contract': 'Contract',
            'internship': 'Internship',
            'apprenticeship': 'Apprenticeship',
            'seasonal': 'Seasonal'
        };
        return types[type] || type;
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Present';
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const experiencesList = context.experiences && context.experiences.length > 0
        ? context.experiences.map((exp, i) => {
            const duration = `${formatDate(exp.startDate)} - ${exp.isCurrent ? 'Present' : formatDate(exp.endDate)}`;
            const location = exp.location ? ` (${exp.location}, ${exp.locationType})` : '';
            const description = exp.description ? `\n   ${exp.description}` : '';
            return `${i + 1}. **${exp.title}** at **${exp.company}** - ${formatEmploymentType(exp.employmentType)}${location}\n   Duration: ${duration}${description}`;
        }).join('\n\n')
        : 'No work experience listed.';

    // Format education
    const educationsList = context.educations && context.educations.length > 0
        ? context.educations.map((edu, i) => {
            const duration = `${formatDate(edu.startDate)} - ${edu.isCurrent ? 'Present' : formatDate(edu.endDate)}`;
            const degree = edu.degree ? ` - ${edu.degree}` : '';
            const field = edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : '';
            const grade = edu.grade ? `\n   Grade: ${edu.grade}` : '';
            const description = edu.description ? `\n   ${edu.description}` : '';
            const activities = edu.activities ? `\n   Activities: ${edu.activities}` : '';
            return `${i + 1}. **${edu.school}**${degree}${field}\n   Duration: ${duration}${grade}${description}${activities}`;
        }).join('\n\n')
        : 'No education history listed.';

    return `You are a virtual assistant for Gaza Al Ghozali Chansa portfolio. Gaza Al Ghozali Chansa (pronounced: Gaza) is a Undergraduate Bachelor of Computer Science student from Diponegoro University, Indonesia.

INFORMATION ABOUT GZAAA:

## About
${context.profile?.description || 'Full Stack Developer focused on web development.'}

## Work Experience
${experiencesList}

## Education
${educationsList}

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
