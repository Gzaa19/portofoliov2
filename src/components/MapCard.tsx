"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import memojiImage from "@/assets/images/memoji-computer.png";

interface Location {
    id: string;
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    zoom: number;
    isActive: boolean;
}

interface MapCardProps {
    className?: string;
}

export const MapCard = ({ className = "" }: MapCardProps) => {
    const [location, setLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await fetch("/api/location");
                const data = await res.json();
                setLocation(data);
            } catch (error) {
                console.error("Failed to fetch location:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, []);

    // Default location if none set
    const latitude = location?.latitude ?? -6.2088;
    const longitude = location?.longitude ?? 106.8456;
    const zoom = location?.zoom ?? 12;
    const locationName = location?.name ?? "Jakarta, Indonesia";

    // Apple Maps URL for link
    const appleMapsUrl = `https://maps.apple.com/?ll=${latitude},${longitude}&z=${zoom}&t=m`;

    // Show loading or no location state
    if (isLoading) {
        return (
            <div className={`relative rounded-3xl overflow-hidden bg-[#1a1f2e] border border-white/10 ${className}`}>
                <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
                    <div className="text-white/50">Loading...</div>
                </div>
            </div>
        );
    }

    if (!location) {
        return (
            <div className={`relative rounded-3xl overflow-hidden bg-[#1a1f2e] border border-white/10 ${className}`}>
                <div className="w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4">📍</div>
                    <div className="text-white/50 text-lg">Location not set</div>
                    <div className="text-white/30 text-sm mt-2">Configure location in admin panel</div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className={`relative rounded-3xl overflow-hidden bg-[#1a1f2e] border border-white/10 ${className}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
        >
            {/* Map Background - Apple Maps Style Dark Theme */}
            <div className="relative w-full h-[400px] md:h-[500px]">
                {/* Using Google Maps with Apple Maps-like styling */}
                <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${Math.pow(2, 20 - zoom) * 1000}!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1702600000000!5m2!1sen!2sid`}
                    width="100%"
                    height="100%"
                    style={{
                        border: 0,
                        // Apple Maps-like color - brighter version
                        filter: "invert(100%) hue-rotate(180deg) saturate(0.7) brightness(0.7) contrast(1.0)",
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                />

                {/* Overlay to disable map interaction */}
                <div className="absolute inset-0 z-10" />

                {/* Light blue tint overlay */}
                <div
                    className="absolute inset-0 pointer-events-none mix-blend-soft-light z-20"
                    style={{
                        background: "linear-gradient(180deg, rgba(30, 60, 100, 0.2) 0%, rgba(20, 50, 80, 0.2) 100%)",
                    }}
                />

                {/* Memoji Avatar - Clean Pin Point */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <motion.div
                        className="relative"
                        animate={{
                            y: [0, -6, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {/* Shadow */}
                        <div className="absolute inset-0 rounded-full bg-black/20 blur-xl scale-110" />

                        {/* Avatar Container - White background, no border */}
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-xl overflow-hidden flex items-center justify-center">
                            <Image
                                src={memojiImage}
                                alt="Location Avatar"
                                width={80}
                                height={80}
                                className="w-12 h-12 md:w-16 md:h-16 object-contain"
                            />
                        </div>

                        {/* Pin point indicator - White arrow */}
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-white" />
                        </div>
                    </motion.div>
                </div>

                {/* Location Label */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-40">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1f2e]/90 backdrop-blur-sm border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-white/80 text-sm font-medium">{locationName}</span>
                    </motion.div>

                    {/* Open in Apple Maps button */}
                    <motion.a
                        href={appleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 text-sm font-medium hover:bg-white/20 hover:text-white transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Open in Maps
                    </motion.a>
                </div>
            </div>
        </motion.div>
    );
};

export default MapCard;
