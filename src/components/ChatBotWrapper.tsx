"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamic import to prevent SSR issues
const ChatBot = dynamic(() => import("@/components/ChatBot"), {
    ssr: false,
});

export function ChatBotWrapper() {
    const pathname = usePathname();

    // Hide chatbot on admin pages
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return <ChatBot />;
}
