"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { THEME_COLORS } from "@/lib/theme";

interface FolderProjectCardProps {
    title: string;
    slug: string;
    image?: string;
    className?: string;
}

/**
 * Mini Project Card for Folder component - shows image + title, navigates on click
 * Uses theme colors from theme.ts
 */
export function FolderProjectCard({
    title,
    slug,
    image,
    className,
}: FolderProjectCardProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent folder toggle
        router.push(`/projects/${slug}`);
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "w-full h-full rounded-lg overflow-hidden cursor-pointer",
                "shadow-sm",
                "hover:shadow-lg hover:scale-105 transition-all duration-200",
                "flex flex-col",
                className
            )}
            style={{ backgroundColor: THEME_COLORS.bgSecondaryHex }}
        >
            {/* Project Image */}
            <div
                className="relative flex-1 overflow-hidden"
                style={{ backgroundColor: THEME_COLORS.bgSecondaryHex }}
            >
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${THEME_COLORS.bgSecondaryHex} 0%, #E2E8F0 100%)`
                        }}
                    >
                        <span className="text-lg">🚀</span>
                    </div>
                )}
            </div>

            {/* Title below image - Light Slate/Teal theme */}
            <div
                className="p-1.5 border-t"
                style={{
                    backgroundColor: THEME_COLORS.bgSecondaryHex,
                    borderColor: '#E2E8F0'
                }}
            >
                <h4
                    className="text-[8px] font-serif font-bold text-center leading-tight truncate"
                    style={{ color: THEME_COLORS.headingHex }}
                >
                    {title}
                </h4>
            </div>
        </div>
    );
}

export default FolderProjectCard;


