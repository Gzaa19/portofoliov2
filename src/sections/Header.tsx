"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
];

export const Header = () => {
    const pathname = usePathname();

    return (
        <>
            {/* Backdrop Blur */}
            <div
                className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-none backdrop-blur-md"
                style={{
                    maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                }}
            />

            {/* Navbar Container */}
            <motion.div
                className="flex justify-center items-center fixed top-3 w-full z-50"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <nav className="flex gap-1 p-0.5 border border-white/15 rounded-full bg-white/10 backdrop-blur-lg shadow-lg shadow-black/10 relative">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                // Gunakan class 'nav-item' dari global.css untuk shape & padding
                                // TAPI: Kita handle warna text manual agar kontras dengan pill putih
                                className={`nav-item relative z-10 flex items-center justify-center transition-colors duration-200 ${isActive ? "!text-gray-900" : "text-white/70 hover:text-white"
                                    }`}
                                // Matikan background hover bawaan CSS jika item sedang aktif
                                style={{
                                    backgroundColor: "transparent",
                                }}
                            >
                                {/* Ini ANIMASI GESERNYA (Sliding Pill) */}
                                {isActive && (
                                    <motion.span
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-white rounded-full -z-10"
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                        // style ini mencegah pill ikut ke-render di posisi aneh saat loading
                                        style={{ originY: "0px" }}
                                    />
                                )}

                                <span className="relative z-20">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </motion.div>
        </>
    );
};

export default Header;