"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { GeminiStarIcon } from "@/components/GeminiStarIcon";

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
                content: "Hi, I'm **Gzaaa's** AI assistant. How can I help you?",
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
            {/* Chat Toggle Button - Black & White Theme */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gray-900 shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center group border border-gray-700"
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
                            className="w-6 h-6 text-white"
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
                            <GeminiStarIcon size={28} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulse effect when closed */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-gray-700 animate-ping opacity-20" />
                )}
            </motion.button>

            {/* Chat Window - Dark Theme */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-150px)] bg-gray-950 rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden"
                    >
                        {/* Header - Dark */}
                        <div className="bg-gray-900 px-5 py-4 flex items-center gap-3 border-b border-gray-800">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <GeminiStarIcon size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold text-sm">Gzaaa&apos;s AI Assistant</h3>
                                <p className="text-gray-400 text-xs">Powered by Perplexity AI</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages - Dark Theme */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === "user"
                                            ? "bg-white text-gray-900 rounded-br-md"
                                            : "bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700"
                                            }`}
                                    >
                                        {message.role === "assistant" ? (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                                                    li: ({ children }) => <li className="text-gray-200">{children}</li>,
                                                    a: ({ href, children }) => (
                                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                            {children}
                                                        </a>
                                                    ),
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        ) : (
                                            message.content
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Suggested Questions - Dark Theme */}
                            {showSuggestions && messages.length === 1 && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-3"
                                >
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {SUGGESTED_QUESTIONS.map((q, index) => (
                                            <motion.button
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.3 + index * 0.05 }}
                                                onClick={() => handleSuggestionClick(q.text)}
                                                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-all"
                                            >
                                                {q.text}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
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

                        {/* Input - Dark Theme */}
                        <div className="p-4 border-t border-gray-800 bg-gray-900">
                            <div className="flex items-center gap-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 rounded-xl bg-white text-gray-900 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
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
