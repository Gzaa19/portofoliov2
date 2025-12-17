// ==========================================
// Hero Actions - State management untuk Hero Settings
// ==========================================

import type { HeroSettings } from "@/types/types";

export interface HeroState {
    settings: HeroSettings | null;
    isLoading: boolean;
    isSaving: boolean;
    formData: HeroFormData;
}

export interface HeroFormData {
    name: string;
    role: string;
    status: "available" | "busy" | "new_project";
}

export const initialHeroFormData: HeroFormData = {
    name: "",
    role: "",
    status: "available",
};

export const initialHeroState: HeroState = {
    settings: null,
    isLoading: true,
    isSaving: false,
    formData: initialHeroFormData,
};

// Action Types
export type HeroAction =
    | { type: "SET_SETTINGS"; payload: HeroSettings }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_SAVING"; payload: boolean }
    | { type: "UPDATE_FORM"; payload: Partial<HeroFormData> }
    | { type: "RESET_FORM" };

// Reducer
export function heroReducer(state: HeroState, action: HeroAction): HeroState {
    switch (action.type) {
        case "SET_SETTINGS":
            return {
                ...state,
                settings: action.payload,
                formData: {
                    name: action.payload.name || "",
                    role: action.payload.role || "",
                    status: action.payload.status || "available",
                },
            };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_SAVING":
            return { ...state, isSaving: action.payload };
        case "UPDATE_FORM":
            return { ...state, formData: { ...state.formData, ...action.payload } };
        case "RESET_FORM":
            return { ...state, formData: initialHeroFormData };
        default:
            return state;
    }
}

// Action Creators
export const heroActions = {
    setSettings: (settings: HeroSettings): HeroAction => ({
        type: "SET_SETTINGS",
        payload: settings,
    }),
    setLoading: (loading: boolean): HeroAction => ({
        type: "SET_LOADING",
        payload: loading,
    }),
    setSaving: (saving: boolean): HeroAction => ({
        type: "SET_SAVING",
        payload: saving,
    }),
    updateForm: (data: Partial<HeroFormData>): HeroAction => ({
        type: "UPDATE_FORM",
        payload: data,
    }),
    resetForm: (): HeroAction => ({
        type: "RESET_FORM",
    }),
};
