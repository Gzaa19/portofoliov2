// ==========================================
// Location Actions - State management untuk Location
// ==========================================
'use server';
import type { Location } from "@/types/types";

export interface LocationState {
    location: Location | null;
    isLoading: boolean;
    isModalOpen: boolean;
    isEditing: boolean;
    formData: LocationFormData;
    searchQuery: string;
    searchResults: GeocodingResult[];
    isSearching: boolean;
}

export interface LocationFormData {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    zoom: number;
    isActive: boolean;
}

export interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
}

export const initialLocationFormData: LocationFormData = {
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    zoom: 12,
    isActive: true,
};

export const initialLocationState: LocationState = {
    location: null,
    isLoading: false,
    isModalOpen: false,
    isEditing: false,
    formData: initialLocationFormData,
    searchQuery: "",
    searchResults: [],
    isSearching: false,
};

// Action Types
export type LocationAction =
    | { type: "SET_LOCATION"; payload: Location | null }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "OPEN_CREATE_MODAL" }
    | { type: "OPEN_EDIT_MODAL" }
    | { type: "CLOSE_MODAL" }
    | { type: "UPDATE_FORM"; payload: Partial<LocationFormData> }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_SEARCH_RESULTS"; payload: GeocodingResult[] }
    | { type: "SET_SEARCHING"; payload: boolean }
    | { type: "SELECT_LOCATION"; payload: GeocodingResult }
    | { type: "RESET_FORM" };

// Reducer
export function locationReducer(state: LocationState, action: LocationAction): LocationState {
    switch (action.type) {
        case "SET_LOCATION":
            return {
                ...state,
                location: action.payload,
                formData: action.payload
                    ? {
                        name: action.payload.name,
                        address: action.payload.address || "",
                        latitude: action.payload.latitude,
                        longitude: action.payload.longitude,
                        zoom: action.payload.zoom,
                        isActive: action.payload.isActive,
                    }
                    : initialLocationFormData,
            };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "OPEN_CREATE_MODAL":
            return {
                ...state,
                isModalOpen: true,
                isEditing: false,
                formData: initialLocationFormData,
                searchQuery: "",
                searchResults: [],
            };
        case "OPEN_EDIT_MODAL":
            return {
                ...state,
                isModalOpen: true,
                isEditing: true,
                searchQuery: "",
                searchResults: [],
            };
        case "CLOSE_MODAL":
            return { ...state, isModalOpen: false };
        case "UPDATE_FORM":
            return { ...state, formData: { ...state.formData, ...action.payload } };
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.payload };
        case "SET_SEARCH_RESULTS":
            return { ...state, searchResults: action.payload };
        case "SET_SEARCHING":
            return { ...state, isSearching: action.payload };
        case "SELECT_LOCATION":
            return {
                ...state,
                formData: {
                    ...state.formData,
                    name:
                        action.payload.name.split(",")[0] +
                        ", " +
                        (action.payload.name.split(",").slice(-1)[0] || "").trim(),
                    address: action.payload.address,
                    latitude: action.payload.latitude,
                    longitude: action.payload.longitude,
                },
                searchResults: [],
                searchQuery: "",
            };
        case "RESET_FORM":
            return { ...state, formData: initialLocationFormData };
        default:
            return state;
    }
}

// Action Creators
export const locationActions = {
    setLocation: (location: Location | null): LocationAction => ({
        type: "SET_LOCATION",
        payload: location,
    }),
    setLoading: (loading: boolean): LocationAction => ({
        type: "SET_LOADING",
        payload: loading,
    }),
    openCreateModal: (): LocationAction => ({
        type: "OPEN_CREATE_MODAL",
    }),
    openEditModal: (): LocationAction => ({
        type: "OPEN_EDIT_MODAL",
    }),
    closeModal: (): LocationAction => ({
        type: "CLOSE_MODAL",
    }),
    updateForm: (data: Partial<LocationFormData>): LocationAction => ({
        type: "UPDATE_FORM",
        payload: data,
    }),
    setSearchQuery: (query: string): LocationAction => ({
        type: "SET_SEARCH_QUERY",
        payload: query,
    }),
    setSearchResults: (results: GeocodingResult[]): LocationAction => ({
        type: "SET_SEARCH_RESULTS",
        payload: results,
    }),
    setSearching: (searching: boolean): LocationAction => ({
        type: "SET_SEARCHING",
        payload: searching,
    }),
    selectLocation: (result: GeocodingResult): LocationAction => ({
        type: "SELECT_LOCATION",
        payload: result,
    }),
    resetForm: (): LocationAction => ({
        type: "RESET_FORM",
    }),
};
