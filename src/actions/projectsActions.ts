// ==========================================
// Project Actions - State management untuk Projects
// ==========================================

import type { Project } from "@/types/types";

export interface ProjectsState {
    projects: Project[];
    isLoading: boolean;
    isModalOpen: boolean;
    editingProject: Project | null;
    formData: ProjectFormData;
    searchQuery: string;
    showIconSearch: boolean;
    iconSearch: string;
}

export interface ProjectFormData {
    slug: string;
    title: string;
    description: string;
    link: string;
    github: string;
    image: string;
    featured: boolean;
    selectedTags: string[];
}

export const initialProjectFormData: ProjectFormData = {
    slug: "",
    title: "",
    description: "",
    link: "",
    github: "",
    image: "",
    featured: false,
    selectedTags: [],
};

export const initialProjectsState: ProjectsState = {
    projects: [],
    isLoading: false,
    isModalOpen: false,
    editingProject: null,
    formData: initialProjectFormData,
    searchQuery: "",
    showIconSearch: false,
    iconSearch: "",
};

// Action Types
export type ProjectsAction =
    | { type: "SET_PROJECTS"; payload: Project[] }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "OPEN_CREATE_MODAL" }
    | { type: "OPEN_EDIT_MODAL"; payload: Project }
    | { type: "CLOSE_MODAL" }
    | { type: "UPDATE_FORM"; payload: Partial<ProjectFormData> }
    | { type: "SET_SEARCH"; payload: string }
    | { type: "SET_ICON_SEARCH"; payload: string }
    | { type: "TOGGLE_ICON_SEARCH"; payload: boolean }
    | { type: "RESET_FORM" };

// Reducer
export function projectsReducer(state: ProjectsState, action: ProjectsAction): ProjectsState {
    switch (action.type) {
        case "SET_PROJECTS":
            return { ...state, projects: action.payload };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "OPEN_CREATE_MODAL":
            return {
                ...state,
                isModalOpen: true,
                editingProject: null,
                formData: initialProjectFormData,
            };
        case "OPEN_EDIT_MODAL":
            return {
                ...state,
                isModalOpen: true,
                editingProject: action.payload,
                formData: {
                    slug: action.payload.slug,
                    title: action.payload.title,
                    description: action.payload.description,
                    link: action.payload.link || "",
                    github: action.payload.github || "",
                    image: action.payload.image || "",
                    featured: action.payload.featured,
                    selectedTags: action.payload.tags?.map((t) => t.name) || [],
                },
            };
        case "CLOSE_MODAL":
            return { ...state, isModalOpen: false, editingProject: null };
        case "UPDATE_FORM":
            return { ...state, formData: { ...state.formData, ...action.payload } };
        case "SET_SEARCH":
            return { ...state, searchQuery: action.payload };
        case "SET_ICON_SEARCH":
            return { ...state, iconSearch: action.payload };
        case "TOGGLE_ICON_SEARCH":
            return { ...state, showIconSearch: action.payload };
        case "RESET_FORM":
            return { ...state, formData: initialProjectFormData };
        default:
            return state;
    }
}

// Action Creators
export const projectsActions = {
    setProjects: (projects: Project[]): ProjectsAction => ({
        type: "SET_PROJECTS",
        payload: projects,
    }),
    setLoading: (loading: boolean): ProjectsAction => ({
        type: "SET_LOADING",
        payload: loading,
    }),
    openCreateModal: (): ProjectsAction => ({
        type: "OPEN_CREATE_MODAL",
    }),
    openEditModal: (project: Project): ProjectsAction => ({
        type: "OPEN_EDIT_MODAL",
        payload: project,
    }),
    closeModal: (): ProjectsAction => ({
        type: "CLOSE_MODAL",
    }),
    updateForm: (data: Partial<ProjectFormData>): ProjectsAction => ({
        type: "UPDATE_FORM",
        payload: data,
    }),
    setSearch: (query: string): ProjectsAction => ({
        type: "SET_SEARCH",
        payload: query,
    }),
    setIconSearch: (query: string): ProjectsAction => ({
        type: "SET_ICON_SEARCH",
        payload: query,
    }),
    toggleIconSearch: (show: boolean): ProjectsAction => ({
        type: "TOGGLE_ICON_SEARCH",
        payload: show,
    }),
    resetForm: (): ProjectsAction => ({
        type: "RESET_FORM",
    }),
};
