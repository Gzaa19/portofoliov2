"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MdBusiness, MdSearch, MdClose } from "react-icons/md";

interface CompanyResult {
    name: string;
    domain: string;
    logo: string;
}

interface CompanySearchInputProps {
    value: string;
    logoUrl: string;
    onCompanyChange: (companyName: string, logoUrl: string) => void;
    placeholder?: string;
    required?: boolean;
}

/**
 * Company Search Input with Autocomplete
 * Searches companies and auto-fetches their logos like LinkedIn
 * Uses Google Favicon API for company logos (free and reliable)
 */
export function CompanySearchInput({
    value,
    logoUrl,
    onCompanyChange,
    placeholder = "Search company...",
    required = false,
}: CompanySearchInputProps) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<CompanyResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [logoError, setLogoError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Update input when value prop changes
    useEffect(() => {
        setInputValue(value);
        setLogoError(false);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search companies using our API
    const searchCompanies = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);

            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.companies || []);
            } else {
                // Fallback: generate logo URL using Google Favicon
                const domain = query.toLowerCase().replace(/\s+/g, '') + '.com';
                setSuggestions([{
                    name: query,
                    domain: domain,
                    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
                }]);
            }
        } catch (error) {
            console.error("Error searching companies:", error);
            const domain = query.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
            setSuggestions([{
                name: query,
                domain: domain,
                logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
            }]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setShowDropdown(true);
        setSelectedIndex(-1);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            searchCompanies(newValue);
        }, 300);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown || suggestions.length === 0) {
            if (e.key === "Enter") {
                e.preventDefault();
                onCompanyChange(inputValue, logoUrl);
                setShowDropdown(false);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelectCompany(suggestions[selectedIndex]);
                } else {
                    onCompanyChange(inputValue, logoUrl);
                    setShowDropdown(false);
                }
                break;
            case "Escape":
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
        }
    };

    // Handle company selection
    const handleSelectCompany = (company: CompanyResult) => {
        setInputValue(company.name);
        onCompanyChange(company.name, company.logo);
        setShowDropdown(false);
        setSuggestions([]);
        setSelectedIndex(-1);
        setLogoError(false);
    };

    // Clear selection
    const handleClear = () => {
        setInputValue("");
        onCompanyChange("", "");
        setSuggestions([]);
        setLogoError(false);
        inputRef.current?.focus();
    };

    return (
        <div className="relative">
            {/* Input with company logo preview */}
            <div className="relative flex items-center gap-2">
                {/* Logo preview */}
                <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {logoUrl && !logoError ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={logoUrl}
                            alt="Company logo"
                            className="w-full h-full object-contain p-1"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <MdBusiness className="text-gray-400 text-xl" />
                    )}
                </div>

                {/* Search input */}
                <div className="flex-1 relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        required={required}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (inputValue.length >= 2) {
                                searchCompanies(inputValue);
                                setShowDropdown(true);
                            }
                        }}
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                        placeholder={placeholder}
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <MdClose size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown suggestions */}
            {showDropdown && (suggestions.length > 0 || isLoading) && (
                <div
                    ref={dropdownRef}
                    className="absolute left-12 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                >
                    {isLoading ? (
                        <div className="p-3 text-center text-gray-500 text-sm">
                            <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                            Searching companies...
                        </div>
                    ) : (
                        suggestions.map((company, index) => (
                            <CompanySuggestionItem
                                key={`${company.domain}-${index}`}
                                company={company}
                                isSelected={index === selectedIndex}
                                onClick={() => handleSelectCompany(company)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// Separate component for suggestion items to handle individual logo errors
function CompanySuggestionItem({
    company,
    isSelected,
    onClick
}: {
    company: CompanyResult;
    isSelected: boolean;
    onClick: () => void;
}) {
    const [imgError, setImgError] = useState(false);

    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 transition-colors ${isSelected ? "bg-blue-50" : ""}`}
        >
            <div className="w-8 h-8 rounded border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                {company.logo && !imgError ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-contain p-0.5"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <MdBusiness className="text-gray-400" />
                )}
            </div>
            <div className="text-left">
                <div className="font-medium text-gray-900 text-sm">
                    {company.name}
                </div>
                <div className="text-xs text-gray-500">
                    {company.domain}
                </div>
            </div>
        </button>
    );
}

export default CompanySearchInput;
