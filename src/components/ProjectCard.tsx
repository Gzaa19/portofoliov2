"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import grainImage from "@/assets/images/grain.jpg";

interface ProjectCardProps {
    title: string;
    description: string;
    image?: string | StaticImageData;
    link?: string;
    github?: string;
    detailLink?: string;
}

export const ProjectCard = ({
    title,
    description,
    image,
    link,
    github,
    detailLink,
}: ProjectCardProps) => {
    return (
        <motion.div
            className="group relative h-full flex flex-col rounded-3xl bg-gray-800/60 border border-white/10 overflow-hidden backdrop-blur-sm"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
            {/* Grain Background */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url(${grainImage.src})`,
                }}
            />

            {/* Gradient Glow Effect on Hover */}
            <motion.div
                className="absolute -inset-px bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-cyan-500/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ zIndex: -1 }}
            />

            {/* Animated Border on Hover */}
            <div className="absolute inset-0 rounded-3xl border border-white/0 group-hover:border-emerald-500/30 transition-colors duration-500" />

            {/* Project Image */}
            {image && (
                <div className="relative h-48 md:h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10" />
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
            )}

            {/* Placeholder for projects without image */}
            {!image && (
                <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-emerald-900/30 to-teal-900/30 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10" />
                    <motion.div
                        className="text-6xl opacity-30"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        🚀
                    </motion.div>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6 grow flex flex-col">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 grow">
                    {description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2 mt-auto">
                    {/* View Detail Button */}
                    {detailLink && (
                        <Link
                            href={detailLink}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white text-gray-900 hover:bg-white/90 transition-all duration-300 hover:shadow-lg"
                        >
                            <span>View Project</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>

            {/* Shimmer Effect on Hover */}
            <motion.div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            />
        </motion.div>
    );
};

export default ProjectCard;
