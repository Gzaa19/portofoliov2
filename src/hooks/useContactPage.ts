import {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
    InstagramIcon,
    DiscordIcon,
    SpotifyIcon
} from "@/components/SocialIcons";
import type { SocialLink } from "@/types/types";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
    InstagramIcon,
    DiscordIcon,
    SpotifyIcon,
};
