"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import grainImage from "@/assets/images/grain.jpg";

interface SectionCardProps {
    children: ReactNode;
    className?: string;
}

export const SectionCard = ({
    children,
    className = "",
}: SectionCardProps) => {
    return (
        <motion.div
            className={`relative rounded-3xl bg-gray-800/80 border border-white/10 overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
        >
            {/* Grain Background */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url(${grainImage.src})`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default SectionCard;
