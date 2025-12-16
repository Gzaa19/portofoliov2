"use client";

import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CardItem {
    id: string | number;
    image: string | StaticImageData;
    alt?: string;
    href?: string;
}

interface StackedCardsProps {
    items: CardItem[];
    className?: string;
    cardClassName?: string;
    spread?: number; // Angle spread between cards
    hoverEffect?: boolean;
}

/**
 * StackedCards - Fan/Stack card display effect (React Bits style)
 * Cards are displayed in a fanned arrangement with hover interactions
 */
export function StackedCards({
    items,
    className,
    cardClassName,
    spread = 12,
    hoverEffect = true
}: StackedCardsProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const centerIndex = Math.floor(items.length / 2);

    return (
        <div className={cn(
            "relative flex items-center justify-center h-[400px] w-full",
            className
        )}>
            {items.map((item, index) => {
                const offset = index - centerIndex;
                const rotation = offset * spread;
                const translateX = offset * 60;
                const zIndex = items.length - Math.abs(offset);
                const isHovered = hoveredIndex === index;
                const scale = isHovered ? 1.1 : 1;

                return (
                    <div
                        key={item.id}
                        className={cn(
                            "absolute w-[200px] h-[280px] md:w-[240px] md:h-[320px]",
                            "rounded-3xl overflow-hidden shadow-2xl",
                            "transition-all duration-500 ease-out cursor-pointer",
                            "border-4 border-white/20",
                            hoverEffect && "hover:scale-110 hover:shadow-3xl",
                            cardClassName
                        )}
                        style={{
                            transform: `
                                translateX(${translateX}px) 
                                rotate(${rotation}deg) 
                                scale(${scale})
                            `,
                            zIndex: isHovered ? 100 : zIndex,
                            transformOrigin: "bottom center",
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {item.href ? (
                            <a href={item.href} target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={item.image}
                                    alt={item.alt || "Card image"}
                                    fill
                                    className="object-cover"
                                />
                            </a>
                        ) : (
                            <Image
                                src={item.image}
                                alt={item.alt || "Card image"}
                                fill
                                className="object-cover"
                            />
                        )}

                        <div className={cn(
                            "absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent",
                            "opacity-0 transition-opacity duration-300",
                            isHovered && "opacity-100"
                        )} />
                    </div>
                );
            })}
        </div>
    );
}

interface SocialCardProps {
    images: (string | StaticImageData)[];
    className?: string;
}

/**
 * SocialCard - Wrapper for StackedCards with simpler interface
 */
export function SocialCard({ images, className }: SocialCardProps) {
    const items: CardItem[] = images.map((img, i) => ({
        id: i,
        image: img,
        alt: `Gallery image ${i + 1}`
    }));

    return (
        <div className={cn("py-12", className)}>
            <StackedCards items={items} />
        </div>
    );
}

export default SocialCard;
