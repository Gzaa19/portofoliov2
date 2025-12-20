"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className={cn(
                    "p-2 rounded-full backdrop-blur-md border transition-all duration-300",
                    "w-10 h-10 flex items-center justify-center bg-gray-100 border-gray-200",
                    className
                )}
            />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "p-2 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110",
                isDark
                    ? "bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20 hover:text-yellow-200 shadow-[0_0_15px_rgba(253,224,71,0.3)]"
                    : "bg-white/80 border-gray-200 text-slate-700 hover:bg-white hover:text-slate-900 shadow-sm",
                className
            )}
            aria-label="Toggle Theme"
        >
            {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
    );
}
