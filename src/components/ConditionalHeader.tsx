"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/sections/Header";

export function ConditionalHeader() {
    const pathname = usePathname();

    // Hide header on admin pages
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return <Header />;
}
