/**
 * Theme Configuration
 * 
 * Centralized theme constants that can be used across components.
 * For CSS variables, these are defined in globals.css under :root
 * 
 * Available Themes:
 * - Clean SaaS Look (current)
 * - Deep Sea
 * - Midnight
 */

// Clean SaaS Theme Colors (matches globals.css)
export const THEME_COLORS = {
    // Gradient text colors
    gradient: [
        'var(--theme-gradient-1)',
        'var(--theme-gradient-2)',
        'var(--theme-gradient-3)',
        'var(--theme-gradient-4)',
        'var(--theme-gradient-5)',
    ],

    // Also provide static hex values for places that don't support CSS vars
    gradientHex: ['#2563EB', '#3B82F6', '#60A5FA', '#3B82F6', '#2563EB'],

    // Primary accent
    primary: 'var(--theme-primary)',
    primaryHex: '#2563EB',

    // Text colors
    heading: 'var(--theme-text-heading)',
    headingHex: '#1E293B',
    body: 'var(--theme-text-body)',
    bodyHex: '#475569',
    muted: 'var(--theme-text-muted)',
    mutedHex: '#94A3B8',

    // Background colors
    bg: 'var(--theme-bg)',
    bgHex: '#FFFFFF',
    bgSecondary: 'var(--theme-bg-secondary)',
    bgSecondaryHex: '#F1F5F9',

    // Card colors
    cardBg: 'var(--theme-card-bg)',
    cardBorder: 'var(--theme-card-border)',
    cardText: 'var(--theme-card-text)',

    // Icon color (use primary for icons)
    icon: 'var(--theme-primary)',
    iconHex: '#2563EB',

    // Navigation colors - Light Teal theme
    nav: {
        bgHex: '#F1F5F9',            // Light Teal/Slate background
        pillBgHex: '#FFFFFF',        // White pills
        pillTextHex: '#1E293B',      // Dark text in pill
        pillHoverTextHex: '#2563EB', // Blue text on hover
        hoverCircleHex: '#1E293B',   // Dark hover circle
        borderHex: '#E2E8F0',
    },

    // Section background
    section: {
        bgHex: '#FFFFFF',
    },
};

// Pre-configured gradient arrays for GradientText component
export const GRADIENT_PRESETS = {
    cleanSaas: ['#2563EB', '#3B82F6', '#60A5FA', '#3B82F6', '#2563EB'],
    deepSea: ['#7DD3FC', '#38BDF8', '#0EA5E9', '#38BDF8', '#7DD3FC'],
    midnight: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#A78BFA', '#8B5CF6'],
    gemini: ['#4285f4', '#9b72cb', '#d96570', '#9b72cb', '#4285f4'],
};

// Default export for easy import
export default THEME_COLORS;
