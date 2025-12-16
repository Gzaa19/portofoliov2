"use client";

import { useState, useRef, useCallback } from "react";
import { MdCloudUpload, MdClose, MdImage, MdPictureAsPdf, MdCheck } from "react-icons/md";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
    accept: "image" | "pdf";
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
    className?: string;
}

export function FileDropzone({
    accept,
    value,
    onChange,
    folder = "portfolio/about",
    label,
    className,
}: FileDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const acceptedTypes = accept === "image"
        ? ["image/jpeg", "image/png", "image/gif", "image/webp"]
        : ["application/pdf"];

    const acceptString = accept === "image"
        ? "image/jpeg,image/png,image/gif,image/webp"
        : "application/pdf";

    const Icon = accept === "image" ? MdImage : MdPictureAsPdf;

    const handleFile = useCallback(async (file: File) => {
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
            setError(`Invalid file type. Please upload a ${accept === "image" ? "image" : "PDF"} file.`);
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError("File size must be less than 10MB.");
            return;
        }

        setError(null);
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onprogress = (e) => {
                if (e.lengthComputable) {
                    setUploadProgress(Math.round((e.loaded / e.total) * 50));
                }
            };

            const base64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            setUploadProgress(50);

            // Upload to API
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: base64,
                    folder,
                    resourceType: accept === "image" ? "image" : "raw",
                }),
            });

            setUploadProgress(90);

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            setUploadProgress(100);
            onChange(data.url);
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload file. Please try again.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [accept, acceptedTypes, folder, onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Icon /> {label}
                </label>
            )}

            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer",
                    "flex flex-col items-center justify-center min-h-[160px]",
                    isDragging
                        ? "border-emerald-400 bg-emerald-500/10"
                        : "border-white/20 hover:border-white/40 bg-gray-900/50",
                    isUploading && "pointer-events-none opacity-70"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={acceptString}
                    onChange={handleInputChange}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                        <span className="text-gray-400 text-sm">Uploading... {uploadProgress}%</span>
                        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                ) : value ? (
                    <div className="flex flex-col items-center gap-3 w-full">
                        {accept === "image" ? (
                            <div className="relative">
                                <img
                                    src={value}
                                    alt="Uploaded"
                                    className="w-24 h-24 object-cover rounded-xl border border-white/10"
                                />
                                <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1">
                                    <MdCheck className="text-white text-sm" />
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="w-24 h-24 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                                    <MdPictureAsPdf className="text-red-400 text-4xl" />
                                </div>
                                <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1">
                                    <MdCheck className="text-white text-sm" />
                                </div>
                            </div>
                        )}
                        <p className="text-gray-400 text-xs truncate max-w-full px-4">{value}</p>
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors"
                        >
                            <MdClose /> Remove
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors",
                            isDragging ? "bg-emerald-500/20" : "bg-white/5"
                        )}>
                            <MdCloudUpload className={cn(
                                "text-3xl transition-colors",
                                isDragging ? "text-emerald-400" : "text-gray-400"
                            )} />
                        </div>
                        <p className="text-gray-300 font-medium text-center">
                            {isDragging ? "Drop file here" : "Drag & drop or click to browse"}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            {accept === "image" ? "PNG, JPG, GIF, WebP" : "PDF files only"} (max 10MB)
                        </p>
                    </>
                )}
            </div>

            {error && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                    <MdClose className="shrink-0" /> {error}
                </p>
            )}
        </div>
    );
}

export default FileDropzone;
