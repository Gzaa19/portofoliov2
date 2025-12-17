// ==========================================
// Social Links Actions - State management untuk Social Links
// ==========================================

import type { SocialLink } from "@/types/types";

export interface SocialLinksState {
    socialLinks: SocialLink[];
    isLoading: boolean;
    isModalOpen: boolean;
    editingLink: SocialLink | null;
    formData: SocialLinkFormData;
}

export interface SocialLinkFormData {
    name: string;
    username: string;
    description: string;
    url: string;
    iconName: string;
    iconBg: string;
    isActive: boolean;
}

export const initialSocialLinkFormData: SocialLinkFormData = {
    name: "",
    username: "",
    description: "",
    url: "",
    iconName: "GitHubIcon",
    iconBg: "bg-gray-800",
    isActive: true,
};

export const initialSocialLinksState: SocialLinksState = {
    socialLinks: [],
    isLoading: false,
    isModalOpen: false,
    editingLink: null,
    formData: initialSocialLinkFormData,
};

// Action Types
export type SocialLinksAction =
    | { type: "SET_SOCIAL_LINKS"; payload: SocialLink[] }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "OPEN_CREATE_MODAL" }
    | { type: "OPEN_EDIT_MODAL"; payload: SocialLink }
    | { type: "CLOSE_MODAL" }
    | { type: "UPDATE_FORM"; payload: Partial<SocialLinkFormData> }
    | { type: "RESET_FORM" };

// Reducer
export function socialLinksReducer(
    state: SocialLinksState,
    action: SocialLinksAction
): SocialLinksState {
    switch (action.type) {
        case "SET_SOCIAL_LINKS":
            return { ...state, socialLinks: action.payload };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "OPEN_CREATE_MODAL":
            return {
                ...state,
                isModalOpen: true,
                editingLink: null,
                formData: initialSocialLinkFormData,
            };
        case "OPEN_EDIT_MODAL":
            return {
                ...state,
                isModalOpen: true,
                editingLink: action.payload,
                formData: {
                    name: action.payload.name,
                    username: action.payload.username,
                    description: action.payload.description || "",
                    url: action.payload.url,
                    iconName: action.payload.iconName,
                    iconBg: action.payload.iconBg || "bg-gray-800",
                    isActive: action.payload.isActive,
                },
            };
        case "CLOSE_MODAL":
            return { ...state, isModalOpen: false, editingLink: null };
        case "UPDATE_FORM":
            return { ...state, formData: { ...state.formData, ...action.payload } };
        case "RESET_FORM":
            return { ...state, formData: initialSocialLinkFormData };
        default:
            return state;
    }
}

// Action Creators
export const socialLinksActions = {
    setSocialLinks: (links: SocialLink[]): SocialLinksAction => ({
        type: "SET_SOCIAL_LINKS",
        payload: links,
    }),
    setLoading: (loading: boolean): SocialLinksAction => ({
        type: "SET_LOADING",
        payload: loading,
    }),
    openCreateModal: (): SocialLinksAction => ({
        type: "OPEN_CREATE_MODAL",
    }),
    openEditModal: (link: SocialLink): SocialLinksAction => ({
        type: "OPEN_EDIT_MODAL",
        payload: link,
    }),
    closeModal: (): SocialLinksAction => ({
        type: "CLOSE_MODAL",
    }),
    updateForm: (data: Partial<SocialLinkFormData>): SocialLinksAction => ({
        type: "UPDATE_FORM",
        payload: data,
    }),
    resetForm: (): SocialLinksAction => ({
        type: "RESET_FORM",
    }),
};
