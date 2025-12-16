"use client";

import * as SiIcons from "react-icons/si";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { techStackOptions } from "@/lib/techStackOptions";

type IconSize = "xs" | "sm" | "md" | "lg";

interface TechStackIconProps {
    name: string;
    showLabel?: boolean;
    size?: IconSize;
    className?: string;
}

const sizeConfig: Record<IconSize, { container: string; icon: string; text: string }> = {
    xs: {
        container: "w-12 h-14 p-1.5",
        icon: "w-5 h-5",
        text: "text-[8px]"
    },
    sm: {
        container: "w-14 h-16 p-2",
        icon: "w-6 h-6",
        text: "text-[9px]"
    },
    md: {
        container: "w-16 h-[72px] p-2",
        icon: "w-7 h-7",
        text: "text-[10px]"
    },
    lg: {
        container: "w-20 h-24 p-3",
        icon: "w-10 h-10",
        text: "text-xs"
    },
};

/**
 * TechStackIcon - Displays technology icons from react-icons/si
 */
export function TechStackIcon({
    name,
    showLabel = true,
    size = "sm",
    className
}: TechStackIconProps) {
    const techOption = techStackOptions.find(
        (opt) => opt.name.toLowerCase() === name.toLowerCase()
    );

    const getIcon = (iconName: string): IconType | null => {
        const icons = SiIcons as Record<string, IconType>;
        return icons[iconName] || null;
    };

    const IconComp = techOption ? getIcon(techOption.icon) : null;
    const color = techOption?.color || "#888888";
    const config = sizeConfig[size];

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-xl",
                "bg-gray-800/80 border border-white/5",
                "hover:border-white/20 transition-all duration-200",
                config.container,
                className
            )}
        >
            {IconComp ? (
                <IconComp
                    className={cn(config.icon, "mb-1")}
                    style={{ color }}
                />
            ) : (
                <div className={cn(config.icon, "mb-1 bg-gray-600 rounded")} />
            )}
            {showLabel && (
                <span className={cn(
                    "text-white/60 text-center leading-tight truncate w-full px-0.5",
                    config.text
                )}>
                    {name}
                </span>
            )}
        </div>
    );
}

export default TechStackIcon;
