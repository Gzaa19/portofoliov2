"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";
import Image from "next/image";
import IconAI from "@/assets/images/Icon AI.png";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// Suggested questions templates
const SUGGESTED_QUESTIONS = [
    { text: "View projects" },
    { text: "Skills & tools" },
    { text: "How to contact" },
    { text: "Download resume" },
    { text: "Work experience" },
    { text: "Education" },
    { text: "Availability" },
    { text: "Collaboration" },
];

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Add welcome message when first opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: "welcome",
                role: "assistant",
                content: "Hi, I'm **Gaza Al Ghozali Chansa** AI assistant. How can I help you?",
                timestamp: new Date()
            }]);
            setShowSuggestions(true);
        }
    }, [isOpen, messages.length]);

    const sendMessage = async (messageText?: string) => {
        const textToSend = messageText || input.trim();
        if (!textToSend || isLoading) return;

        // Hide suggestions after first user message
        setShowSuggestions(false);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare history for API (exclude welcome message)
            const history = messages
                .filter(m => m.id !== "welcome")
                .map(m => ({
                    role: m.role,
                    content: m.content
                }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    history
                })
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (data.success) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.message,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                console.error("API Error Details:", data.details);
                throw new Error(data.details || data.error || "Failed to get response");
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `Sorry, something went wrong. Please try again.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSuggestionClick = (question: string) => {
        sendMessage(question);
    };

    return (
        <>
            {/* Chat Toggle Button - Light Teal Theme */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group border border-gray-200 dark:border-gray-700 bg-[#F1F5F9] dark:bg-[#2D2E30]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.svg
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            className="w-6 h-6 text-gray-700 dark:text-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </motion.svg>
                    ) : (
                        <motion.div
                            key="icon"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <GeminiStarIcon size={28} color="#2563EB" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulse effect when closed */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-blue-200 animate-ping opacity-30" />
                )}
            </motion.button>

            {/* Chat Window - Light Teal Theme */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="chat-window"
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <div className="w-9 h-9 relative rounded-full overflow-hidden border border-gray-200">
                                <Image
                                    src={IconAI}
                                    alt="AI Assistant"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Jagga</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Powered by Sonar Pro</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#1E1F20] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 transition-colors duration-300">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={message.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}>
                                        {message.role === "assistant" ? (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                                                    strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>,
                                                    ol: ({ children }) => <ol className="list-decimal list-outside ml-4 space-y-1 my-2 text-gray-800 dark:text-gray-200">{children}</ol>,
                                                    ul: ({ children }) => <ul className="space-y-2 my-3 pl-1">{children}</ul>,
                                                    li: ({ children }) => {
                                                        // Check if children is a string handling normal list items
                                                        return (
                                                            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group/li">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#4169E1]/80 mt-2 shrink-0 group-hover/li:bg-[#4169E1] transition-colors" />
                                                                <span className="flex-1">{children}</span>
                                                            </li>
                                                        );
                                                    },
                                                    a: ({ href, children }) => (
                                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                                            {children}
                                                        </a>
                                                    ),
                                                }}
                                            >
                                                {/* Preprocess content to handle bullet points and spacing better */}
                                                {message.content
                                                    .replace(/ • /g, "\n\n- ") // Handle inline bullets
                                                    .replace(/^• /gm, "- ")    // Handle start of line bullets
                                                }
                                            </ReactMarkdown>
                                        ) : (
                                            message.content
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="chat-bubble-assistant">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area - Light Theme */}
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E1F20] transition-colors duration-300">
                            {/* Quick Questions */}
                            {showSuggestions && messages.length === 1 && !isLoading && (
                                <div className="px-4 pt-3 pb-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Quick questions:</p>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                                        {SUGGESTED_QUESTIONS.map((q, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(q.text)}
                                                className="quick-btn"
                                            >
                                                <span>{q.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Text Input */}
                            <div className={`p-4 ${showSuggestions && messages.length === 1 && !isLoading ? 'pt-2' : ''} flex items-center gap-3`}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="chat-input"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    className="chat-send-btn"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ChatBot;
