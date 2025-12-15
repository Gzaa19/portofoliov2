"use client";
import memojiImage from "@/assets/images/memoji-computer.png"
import Image from "next/image";
import grainImage from "@/assets/images/grain.jpg";
import Link from "next/link";
import { motion } from "framer-motion";

export const Hero = () => {
    return (
        <div className="py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip">
            <div
                className="absolute inset-0 -z-30 opacity-5"
                style={{
                    backgroundImage: `url(${grainImage.src})`
                }}
            ></div>
            <motion.div className="size-[620px] hero-ring" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}></motion.div>
            <motion.div className="size-[820px] hero-ring" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 0.5 }}></motion.div>
            <motion.div className="size-[1020px] hero-ring" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}></motion.div>
            <motion.div className="size-[1220px] hero-ring" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1.5 }}></motion.div>
            <div className="container mx-auto">
                <div className="flex flex-col items-center">
                    <Image
                        src={memojiImage}
                        className="size-[150px]"
                        alt="a peeking computer" />
                    <div className="bg-gray-950 border border-gray-800 px-4 py-1.5 inline-flex items-center gap-4 rounded-lg">
                        <div className="relative flex items-center justify-center">
                            {/* Outer glow ring */}
                            <motion.div
                                className="absolute size-6 rounded-full bg-green-500/20"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            {/* Middle pulse ring */}
                            <motion.div
                                className="absolute size-4 rounded-full bg-green-400/30"
                                animate={{
                                    scale: [1, 1.8, 1],
                                    opacity: [0.7, 0, 0.7],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.3,
                                }}
                            />
                            {/* Core LED dot */}
                            <motion.div
                                className="relative size-2.5 rounded-full bg-green-500"
                                animate={{
                                    boxShadow: [
                                        "0 0 4px 2px rgba(34, 197, 94, 0.4)",
                                        "0 0 12px 4px rgba(34, 197, 94, 0.8)",
                                        "0 0 4px 2px rgba(34, 197, 94, 0.4)",
                                    ],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>
                        <div className="text-sm font-medium">Available for new projects</div>
                    </div>
                    <div className="max-w-lg mx-auto">
                        <h1 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide">Hello, I'm Gzaaa</h1>
                        <p className="mt-4 text-center text-white/60 md:text-lg font-sans">Full Stack Developer</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
                        <Link href="/projects" className="inline-flex items-center justify-center gap-2 border border-white/15 px-6 h-12 rounded-xl text-white font-semibold cursor-pointer z-50 w-48 md:w-auto">
                            <span className="font-semibold">Explore My Work</span>
                        </Link>
                        <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white text-gray-900 px-6 h-12 rounded-xl font-semibold cursor-pointer z-50 w-48 md:w-auto">
                            <span className="font-semibold">Let's Connect</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Hero;