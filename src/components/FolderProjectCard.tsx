"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FolderProjectCardProps {
    title: string;
    slug: string;
    image?: string;
    className?: string;
}

/**
 * Mini Project Card for Folder component - shows image + title, navigates on click
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
                "bg-white shadow-sm",
                "hover:shadow-lg hover:scale-105 transition-all duration-200",
                "flex flex-col",
                className
            )}
        >
            {/* Project Image */}
            <div className="relative flex-1 overflow-hidden bg-gray-100">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <span className="text-lg">🚀</span>
                    </div>
                )}
            </div>

            {/* Title below image */}
            <div className="p-1.5 bg-white border-t border-gray-200">
                <h4 className="text-[8px] font-serif font-bold text-gray-900 text-center leading-tight truncate">
                    {title}
                </h4>
            </div>
        </div>
    );
}

export default FolderProjectCard;

