"use client";

import React from "react";

interface FormattedTextProps {
    text: string;
    className?: string;
    textColor?: string;
    style?: React.CSSProperties;
}

export function FormattedText({ text, className = "", textColor = "text-gray-400", style }: FormattedTextProps) {
    if (!text) return null;

    return (
        <div className={`space-y-2 text-sm leading-relaxed ${textColor} ${className}`} style={style}>
            {text.split('\n').map((line, i) => {
                const trimmed = line.trim();
                // Deteksi bullet points (dimulai dengan •, -, *)
                const isBullet = /^[•\-*]/.test(trimmed);

                if (isBullet) {
                    return (
                        <div key={i} className="flex items-start gap-3 pl-2 group/item">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4169E1]/60 mt-2 shrink-0 group-hover/item:bg-[#4169E1] transition-colors"></span>
                            <span className="flex-1">{trimmed.replace(/^[•\-*]\s*/, '')}</span>
                        </div>
                    );
                }

                // Jika baris kosong
                if (!trimmed) return <div key={i} className="h-2" />;

                // Logic tambahan: Deteksi inline bullets seperti "Key Features • Feature 1 • Feature 2"
                // Ini menangani kasus teks deskripsi proyek user
                if (trimmed.includes(" • ")) {
                    // Split hanya jika bullet bukan di awal, tapi sebagai separator antar item
                    const parts = trimmed.split(/(?=\s•\s)/);
                    // Regex lookahead untuk keep delimiter atau kita split manual saja biar aman

                    if (parts.length > 1) {
                        return (
                            <div key={i}>
                                {parts.map((part, j) => {
                                    const partTrimmed = part.trim().replace(/^•\s*/, '');
                                    if (j === 0 && !part.trim().startsWith('•')) {
                                        // Bagian pertama bukan bullet (Judul/Intro)
                                        return <p key={j} className="mb-2">{partTrimmed}</p>;
                                    } else {
                                        // Bagian selanjutnya adalah bullet items
                                        return (
                                            <div key={j} className="flex items-start gap-3 pl-2 mb-2 group/item">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#4169E1]/60 mt-2 shrink-0 group-hover/item:bg-[#4169E1] transition-colors"></span>
                                                <span className="flex-1">{partTrimmed}</span>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        );
                    }
                }

                return <p key={i}>{line}</p>;
            })}
        </div>
    );
}
