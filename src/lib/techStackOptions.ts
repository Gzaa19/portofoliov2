// Tech Stack Icons available for selection
// Using react-icons/si (Simple Icons)

export const techStackOptions = [
    // Programming Languages
    { name: "HTML5", slug: "html5", icon: "SiHtml5", color: "#E34F26" },
    { name: "CSS3", slug: "css3", icon: "SiCss3", color: "#1572B6" },
    { name: "JavaScript", slug: "javascript", icon: "SiJavascript", color: "#F7DF1E" },
    { name: "TypeScript", slug: "typescript", icon: "SiTypescript", color: "#3178C6" },
    { name: "PHP", slug: "php", icon: "SiPhp", color: "#777BB4" },
    { name: "Python", slug: "python", icon: "SiPython", color: "#3776AB" },
    { name: "C", slug: "c", icon: "SiC", color: "#A8B9CC" },
    { name: "Java", slug: "java", icon: "SiOpenjdk", color: "#ED8B00" },
    { name: "Go", slug: "go", icon: "SiGo", color: "#00ADD8" },
    { name: "Rust", slug: "rust", icon: "SiRust", color: "#000000" },

    // Frameworks & Libraries
    { name: "React", slug: "react", icon: "SiReact", color: "#61DAFB" },
    { name: "Next.js", slug: "nextjs", icon: "SiNextdotjs", color: "#FFFFFF" },
    { name: "Vue.js", slug: "vuejs", icon: "SiVuedotjs", color: "#4FC08D" },
    { name: "Angular", slug: "angular", icon: "SiAngular", color: "#DD0031" },
    { name: "Svelte", slug: "svelte", icon: "SiSvelte", color: "#FF3E00" },
    { name: "Node.js", slug: "nodejs", icon: "SiNodedotjs", color: "#339933" },
    { name: "Express.js", slug: "expressjs", icon: "SiExpress", color: "#FFFFFF" },
    { name: "Laravel", slug: "laravel", icon: "SiLaravel", color: "#FF2D20" },
    { name: "Django", slug: "django", icon: "SiDjango", color: "#092E20" },
    { name: "Flask", slug: "flask", icon: "SiFlask", color: "#FFFFFF" },
    { name: "Spring", slug: "spring", icon: "SiSpring", color: "#6DB33F" },
    { name: "Tailwind CSS", slug: "tailwindcss", icon: "SiTailwindcss", color: "#06B6D4" },
    { name: "Bootstrap", slug: "bootstrap", icon: "SiBootstrap", color: "#7952B3" },
    { name: "Sass", slug: "sass", icon: "SiSass", color: "#CC6699" },

    // Databases
    { name: "MongoDB", slug: "mongodb", icon: "SiMongodb", color: "#47A248" },
    { name: "PostgreSQL", slug: "postgresql", icon: "SiPostgresql", color: "#336791" },
    { name: "MySQL", slug: "mysql", icon: "SiMysql", color: "#4479A1" },
    { name: "Redis", slug: "redis", icon: "SiRedis", color: "#DC382D" },
    { name: "Firebase", slug: "firebase", icon: "SiFirebase", color: "#FFCA28" },
    { name: "Supabase", slug: "supabase", icon: "SiSupabase", color: "#3ECF8E" },
    { name: "Prisma", slug: "prisma", icon: "SiPrisma", color: "#2D3748" },

    // Tools & Platforms
    { name: "Docker", slug: "docker", icon: "SiDocker", color: "#2496ED" },
    { name: "Kubernetes", slug: "kubernetes", icon: "SiKubernetes", color: "#326CE5" },
    { name: "Git", slug: "git", icon: "SiGit", color: "#F05032" },
    { name: "GitHub", slug: "github", icon: "SiGithub", color: "#FFFFFF" },
    { name: "GitLab", slug: "gitlab", icon: "SiGitlab", color: "#FC6D26" },
    { name: "Vercel", slug: "vercel", icon: "SiVercel", color: "#FFFFFF" },
    { name: "Netlify", slug: "netlify", icon: "SiNetlify", color: "#00C7B7" },
    { name: "AWS", slug: "aws", icon: "SiAmazonwebservices", color: "#FF9900" },
    { name: "Google Cloud", slug: "gcp", icon: "SiGooglecloud", color: "#4285F4" },
    { name: "Railway", slug: "railway", icon: "SiRailway", color: "#FFFFFF" },
    { name: "Figma", slug: "figma", icon: "SiFigma", color: "#F24E1E" },
    { name: "VS Code", slug: "vscode", icon: "SiVisualstudiocode", color: "#007ACC" },
    { name: "Google Colab", slug: "googlecolab", icon: "SiGooglecolab", color: "#F9AB00" },

    // Mobile
    { name: "React Native", slug: "reactnative", icon: "SiReact", color: "#61DAFB" },
    { name: "Flutter", slug: "flutter", icon: "SiFlutter", color: "#02569B" },
    { name: "Swift", slug: "swift", icon: "SiSwift", color: "#FA7343" },
    { name: "Kotlin", slug: "kotlin", icon: "SiKotlin", color: "#7F52FF" },
];

export type TechStackOption = typeof techStackOptions[number];
