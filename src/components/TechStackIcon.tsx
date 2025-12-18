"use client";

import * as SiIcons from "react-icons/si";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { techStackOptions } from "@/lib/techStackOptions";

type IconSize = "xs" | "sm" | "md" | "lg";

interface TechStackIconProps {
    name: string;
    iconName?: string;  // Direct icon name from database (e.g., "SiDart")
    iconColor?: string; // Direct color from database (e.g., "#0175C2")
    showLabel?: boolean;
    showBackground?: boolean;
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
 * Priority: iconName/iconColor props > techStackOptions lookup
 */
export function TechStackIcon({
    name,
    iconName,
    iconColor,
    showLabel = true,
    showBackground = true,
    size = "sm",
    className
}: TechStackIconProps) {
    // Fallback to techStackOptions if iconName not provided
    const techOption = techStackOptions.find(
        (opt) => opt.name.toLowerCase() === name.toLowerCase()
    );

    const getIcon = (iconNameStr: string): IconType | null => {
        const icons = SiIcons as Record<string, IconType>;
        return icons[iconNameStr] || null;
    };

    // Priority: props > techStackOptions
    const resolvedIconName = iconName || techOption?.icon;
    const resolvedColor = iconColor || techOption?.color || "#888888";

    const IconComp = resolvedIconName ? getIcon(resolvedIconName) : null;
    const config = sizeConfig[size];

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-xl",
                showBackground && "bg-gray-800/80 border border-white/5 hover:border-white/20",
                "transition-all duration-200",
                config.container,
                className
            )}
        >
            {IconComp ? (
                <IconComp
                    className={cn(config.icon, showLabel && "mb-1")}
                    style={{ color: resolvedColor }}
                />
            ) : showBackground ? (
                <div className={cn(config.icon, showLabel && "mb-1", "bg-gray-600 rounded")} />
            ) : null}
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

