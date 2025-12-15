"use client";
import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

export const HeroOrbit = ({
    children,
    size,
    rotation,
    spinDuration,
}: PropsWithChildren<{
    size: number;
    rotation: number;
    spinDuration: string;
}>) => {
    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-20">
            <motion.div
                className="flex items-start justify-start"
                style={{
                    height: `${size}px`,
                    width: `${size}px`,
                }}
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: parseFloat(spinDuration),
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <div
                    className="inline-flex"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                    }}
                >
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
