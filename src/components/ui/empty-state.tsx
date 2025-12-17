"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
    message?: string;
    icon?: React.ReactNode;
    className?: string;
}

/**
 * EmptyState - Display when no data is available
 */
export function EmptyState({
    message = "No data available.",
    icon,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "text-center text-gray-400 py-16",
                className
            )}
        >
            {icon && <div className="mb-4">{icon}</div>}
            <p>{message}</p>
        </div>
    );
}
