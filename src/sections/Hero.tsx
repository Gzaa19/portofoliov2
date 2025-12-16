"use client";

import Image from "next/image";
import Link from "next/link";
import memojiImage from "@/assets/images/memoji-computer.png";
import { StatusBadge, Animated, Button } from "@/components/ui";

/**
 * Hero section - main landing component
 */
export function Hero() {
    return (
        <div className="py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip bg-white">
            {/* Hero rings with CSS animation */}
            <div className="size-[620px] hero-ring animate-ring-pulse" />
            <div className="size-[820px] hero-ring animate-ring-pulse delay-500" />
            <div className="size-[1020px] hero-ring animate-ring-pulse delay-1000" />
            <div className="size-[1220px] hero-ring animate-ring-pulse delay-1500" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <Animated animation="fade-in">
                        <Image
                            src={memojiImage}
                            className="size-[150px]"
                            alt="Developer avatar"
                            priority
                        />
                    </Animated>

                    {/* Status Badge */}
                    <Animated animation="fade-in-up" delay={100}>
                        <StatusBadge variant="available" />
                    </Animated>

                    {/* Heading */}
                    <Animated animation="fade-in-up" delay={200} className="max-w-lg mx-auto">
                        <h1 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide text-gray-900">
                            Hello, I'm Gzaaa
                        </h1>
                        <p className="mt-4 text-center text-gray-500 md:text-lg font-sans">
                            Full Stack Developer
                        </p>
                    </Animated>

                    {/* CTA Buttons */}
                    <Animated
                        animation="fade-in-up"
                        delay={300}
                        className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4"
                    >
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/projects">
                                Explore My Work
                            </Link>
                        </Button>
                        <Button size="lg" asChild>
                            <Link href="/contact">
                                Let's Connect
                            </Link>
                        </Button>
                    </Animated>
                </div>
            </div>
        </div>
    );
}

export default Hero;