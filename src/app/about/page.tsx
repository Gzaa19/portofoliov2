"use client";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import {
    SiHtml5,
    SiCss3,
    SiJavascript,
    SiPhp,
    SiNodedotjs,
    SiMongodb,
    SiReact,
    SiTypescript,
    SiNextdotjs,
    SiTailwindcss,
    SiPostgresql,
    SiExpress,
    SiPython,
    SiMysql,
    SiDocker,
    SiGit,
    SiLaravel,
    SiC,
    SiGooglecolab,
    SiRailway
} from "react-icons/si";
import { IconType } from "react-icons";

// Assets
import aboutFoto from "@/assets/images/About Foto.png";
import grainImage from "@/assets/images/grain.jpg";

// Components
import { MapCard } from "@/components/MapCard";
import { SectionCard } from "@/components/SectionCard";

// Star Icon Component
const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1C12 1 12 8 10 10C8 12 1 12 1 12C1 12 8 12 10 14C12 16 12 23 12 23C12 23 12 16 14 14C16 12 23 12 23 12C23 12 16 12 14 10C12 8 12 1 12 1Z" fill="currentColor" />
    </svg>
);

// Tech Stack Data organized by category
const techStackCategories = [
    {
        title: "Programming Languages",
        items: [
            { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
            { name: "CSS3", icon: SiCss3, color: "#1572B6" },
            { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
            { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
            { name: "PHP", icon: SiPhp, color: "#777BB4" },
            { name: "Python", icon: SiPython, color: "#3776AB" },
            { name: "C", icon: SiC, color: "#A8B9CC" },
        ]
    },
    {
        title: "Frameworks & Libraries",
        items: [
            { name: "React", icon: SiReact, color: "#61DAFB" },
            { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
            { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
            { name: "Express.js", icon: SiExpress, color: "#FFFFFF" },
            { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
            { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
        ]
    },
    {
        title: "Databases & Tools",
        items: [
            { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
            { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
            { name: "MySQL", icon: SiMysql, color: "#4479A1" },
            { name: "Docker", icon: SiDocker, color: "#2496ED" },
            { name: "Git", icon: SiGit, color: "#F05032" },
            { name: "Google Colab", icon: SiGooglecolab, color: "#F9AB00" },
            { name: "Railway", icon: SiRailway, color: "#FFFFFF" },
        ]
    },
];

export const About = () => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Motion values for mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring animation for smooth movement
    const springConfig = { damping: 25, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate position relative to center (-0.5 to 0.5)
        const x = (e.clientX - centerX) / rect.width;
        const y = (e.clientY - centerY) / rect.height;

        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <>
            <section id="about" className="py-32 overflow-x-clip">
                <div className="container mx-auto px-4">
                    {/* Section Title */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="uppercase text-lg md:text-xl lg:text-2xl font-semibold tracking-[0.2em] bg-gradient-to-r from-emerald-500 to-teal-300 bg-clip-text text-transparent">
                            About Me
                        </h2>
                    </motion.div>

                    {/* Content Container */}
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl mx-auto">

                        {/* Left Side - Photo with Border and 3D Tilt */}
                        <motion.div
                            className="flex-shrink-0"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div
                                ref={cardRef}
                                className="relative"
                                style={{ perspective: 1000 }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Card container with shadow and 3D effect */}
                                <motion.div
                                    className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/30 cursor-pointer"
                                    style={{
                                        rotateX,
                                        rotateY,
                                        transformStyle: "preserve-3d",
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Image
                                        src={aboutFoto}
                                        alt="Profile Photo"
                                        fill
                                        className="object-cover object-center"
                                        priority
                                    />

                                    {/* Shine overlay effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
                                        style={{
                                            opacity: useTransform(mouseX, [-0.5, 0, 0.5], [0, 0.1, 0.3]),
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                        {/* Right Side - About Content */}
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <SectionCard className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <StarIcon className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
                                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white">
                                        Description
                                    </h3>
                                </div>

                                <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6">
                                    With expertise in React, Next.js, Node.js, and various modern technologies,
                                    I create digital solutions that make a difference. I believe in continuous
                                    learning and staying up-to-date with the latest industry trends.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-start">
                                    <motion.a
                                        href="/resume.pdf"
                                        download
                                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 px-6 py-3 rounded-xl text-gray-900 font-semibold transition-all duration-300 shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Resume
                                    </motion.a>
                                </div>
                            </SectionCard>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section id="tech-stack" className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <SectionCard className="p-8 md:p-12">
                        {/* Section Title with Star Icon */}
                        <div className="flex items-center gap-3 mb-4">
                            <StarIcon className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                My Toolbox
                            </h2>
                        </div>

                        <p className="text-white/60 text-sm md:text-base mb-10 max-w-xl">
                            Explore the technologies and tools I use to craft exceptional digital experiences.
                        </p>

                        {/* Tech Stack Categories with Wave Animation */}
                        <div className="space-y-10">
                            {techStackCategories.map((category, categoryIndex) => (
                                <div key={category.title}>
                                    {/* Category Title */}
                                    <motion.h3
                                        className="text-white/40 text-xs md:text-sm font-medium uppercase tracking-wider mb-6"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        {category.title}
                                    </motion.h3>

                                    {/* Tech Cards Grid */}
                                    <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:gap-4">
                                        {category.items.map((tech, index) => (
                                            <motion.div
                                                key={tech.name}
                                                className="flex flex-col items-center justify-center aspect-square w-full md:w-28 md:h-28 md:aspect-auto rounded-2xl bg-gray-800/80 border border-white/5 hover:border-emerald-400/30 transition-colors duration-300 cursor-pointer group p-2 md:p-0"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.08 + categoryIndex * 0.15,
                                                    ease: "easeOut"
                                                }}
                                                whileHover={{ scale: 1.08, y: -5 }}
                                                animate={{
                                                    y: [0, -10, 0],
                                                }}
                                                style={{
                                                    animationDelay: `${index * 0.1}s`,
                                                }}
                                                // Wave animation after initial appear
                                                onAnimationComplete={() => { }}
                                            >
                                                <motion.div
                                                    animate={{
                                                        y: [0, -10, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay: index * 0.12,
                                                    }}
                                                >
                                                    <tech.icon className="w-8 h-8 md:w-12 md:h-12 mb-2 transition-transform group-hover:scale-110" style={{ color: tech.color }} />
                                                </motion.div>
                                                <span className="text-white/70 text-[10px] md:text-sm font-medium text-center group-hover:text-white transition-colors truncate w-full px-1">
                                                    {tech.name}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            </section>

            {/* Map Section */}
            <section id="location" className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <MapCard />
                </div>
            </section>
        </>
    );
};

export default About;
