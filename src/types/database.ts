// Types yang sesuai dengan Prisma schema untuk digunakan di frontend

export interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    link?: string | null;
    github?: string | null;
    image?: string | null;
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
}

export interface SocialLink {
    id: string;
    name: string;
    username: string;
    description?: string | null;
    url: string;
    iconName: string;
    iconBg?: string | null;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Input types untuk create/update
export interface CreateProjectInput {
    slug: string;
    title: string;
    description: string;
    link?: string;
    github?: string;
    image?: string;
    featured?: boolean;
    order?: number;
    tags: string[]; // Array of tag names
}

export interface UpdateProjectInput {
    slug?: string;
    title?: string;
    description?: string;
    link?: string | null;
    github?: string | null;
    image?: string | null;
    featured?: boolean;
    order?: number;
    tags?: string[];
}

export interface CreateSocialLinkInput {
    name: string;
    username: string;
    description?: string;
    url: string;
    iconName: string;
    iconBg?: string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateSocialLinkInput {
    name?: string;
    username?: string;
    description?: string | null;
    url?: string;
    iconName?: string;
    iconBg?: string | null;
    order?: number;
    isActive?: boolean;
}
