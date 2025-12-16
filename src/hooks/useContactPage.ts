import {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
    InstagramIcon,
    DiscordIcon,
    SpotifyIcon
} from "@/components/SocialIcons";

export interface SocialLink {
    id: string;
    name: string;
    username: string;
    description: string | null;
    url: string;
    iconName: string;
    iconBg: string;
    isActive: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
    InstagramIcon,
    DiscordIcon,
    SpotifyIcon,
};
