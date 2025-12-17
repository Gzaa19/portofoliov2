// ==========================================
// Toolbox Actions - State management untuk Toolbox
// ==========================================

import type { ToolboxItem, ToolboxCategory } from "@/types/types";

export interface ToolboxState {
    categories: ToolboxCategory[];
    isLoading: boolean;
    isCategoryModalOpen: boolean;
    isItemModalOpen: boolean;
    editingCategory: ToolboxCategory | null;
    editingItem: ToolboxItem | null;
    selectedCategoryId: string;
    categoryForm: CategoryFormData;
    itemForm: ItemFormData;
    iconSearch: string;
    showIconSearch: boolean;
}

export interface CategoryFormData {
    name: string;
    order: number;
}

export interface ItemFormData {
    name: string;
    iconName: string;
    color: string;
    order: number;
    categoryId: string;
}

export const initialCategoryFormData: CategoryFormData = {
    name: "",
    order: 0,
};

export const initialItemFormData: ItemFormData = {
    name: "",
    iconName: "",
    color: "#FFFFFF",
    order: 0,
    categoryId: "",
};

export const initialToolboxState: ToolboxState = {
    categories: [],
    isLoading: false,
    isCategoryModalOpen: false,
    isItemModalOpen: false,
    editingCategory: null,
    editingItem: null,
    selectedCategoryId: "",
    categoryForm: initialCategoryFormData,
    itemForm: initialItemFormData,
    iconSearch: "",
    showIconSearch: false,
};

// Action Types
export type ToolboxAction =
    | { type: "SET_CATEGORIES"; payload: ToolboxCategory[] }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "OPEN_ADD_CATEGORY" }
    | { type: "OPEN_EDIT_CATEGORY"; payload: ToolboxCategory }
    | { type: "CLOSE_CATEGORY_MODAL" }
    | { type: "OPEN_ADD_ITEM"; payload: { categoryId: string; itemCount: number } }
    | { type: "OPEN_EDIT_ITEM"; payload: ToolboxItem }
    | { type: "CLOSE_ITEM_MODAL" }
    | { type: "UPDATE_CATEGORY_FORM"; payload: Partial<CategoryFormData> }
    | { type: "UPDATE_ITEM_FORM"; payload: Partial<ItemFormData> }
    | { type: "SET_ICON_SEARCH"; payload: string }
    | { type: "TOGGLE_ICON_SEARCH"; payload: boolean }
    | { type: "SELECT_TECH_STACK"; payload: { name: string; iconName: string; color: string } };

// Reducer
export function toolboxReducer(state: ToolboxState, action: ToolboxAction): ToolboxState {
    switch (action.type) {
        case "SET_CATEGORIES":
            return { ...state, categories: action.payload };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "OPEN_ADD_CATEGORY":
            return {
                ...state,
                isCategoryModalOpen: true,
                editingCategory: null,
                categoryForm: { name: "", order: state.categories.length },
            };
        case "OPEN_EDIT_CATEGORY":
            return {
                ...state,
                isCategoryModalOpen: true,
                editingCategory: action.payload,
                categoryForm: { name: action.payload.name, order: action.payload.order },
            };
        case "CLOSE_CATEGORY_MODAL":
            return { ...state, isCategoryModalOpen: false, editingCategory: null };
        case "OPEN_ADD_ITEM":
            return {
                ...state,
                isItemModalOpen: true,
                editingItem: null,
                selectedCategoryId: action.payload.categoryId,
                itemForm: {
                    ...initialItemFormData,
                    order: action.payload.itemCount,
                    categoryId: action.payload.categoryId,
                },
                iconSearch: "",
                showIconSearch: false,
            };
        case "OPEN_EDIT_ITEM":
            return {
                ...state,
                isItemModalOpen: true,
                editingItem: action.payload,
                selectedCategoryId: action.payload.categoryId,
                itemForm: {
                    name: action.payload.name,
                    iconName: action.payload.iconName,
                    color: action.payload.color,
                    order: action.payload.order,
                    categoryId: action.payload.categoryId,
                },
                iconSearch: "",
                showIconSearch: false,
            };
        case "CLOSE_ITEM_MODAL":
            return { ...state, isItemModalOpen: false, editingItem: null };
        case "UPDATE_CATEGORY_FORM":
            return { ...state, categoryForm: { ...state.categoryForm, ...action.payload } };
        case "UPDATE_ITEM_FORM":
            return { ...state, itemForm: { ...state.itemForm, ...action.payload } };
        case "SET_ICON_SEARCH":
            return { ...state, iconSearch: action.payload };
        case "TOGGLE_ICON_SEARCH":
            return { ...state, showIconSearch: action.payload };
        case "SELECT_TECH_STACK":
            return {
                ...state,
                itemForm: {
                    ...state.itemForm,
                    name: action.payload.name,
                    iconName: action.payload.iconName,
                    color: action.payload.color,
                },
                showIconSearch: false,
                iconSearch: "",
            };
        default:
            return state;
    }
}

// Action Creators
export const toolboxActions = {
    setCategories: (categories: ToolboxCategory[]): ToolboxAction => ({
        type: "SET_CATEGORIES",
        payload: categories,
    }),
    setLoading: (loading: boolean): ToolboxAction => ({
        type: "SET_LOADING",
        payload: loading,
    }),
    openAddCategory: (): ToolboxAction => ({
        type: "OPEN_ADD_CATEGORY",
    }),
    openEditCategory: (category: ToolboxCategory): ToolboxAction => ({
        type: "OPEN_EDIT_CATEGORY",
        payload: category,
    }),
    closeCategoryModal: (): ToolboxAction => ({
        type: "CLOSE_CATEGORY_MODAL",
    }),
    openAddItem: (categoryId: string, itemCount: number): ToolboxAction => ({
        type: "OPEN_ADD_ITEM",
        payload: { categoryId, itemCount },
    }),
    openEditItem: (item: ToolboxItem): ToolboxAction => ({
        type: "OPEN_EDIT_ITEM",
        payload: item,
    }),
    closeItemModal: (): ToolboxAction => ({
        type: "CLOSE_ITEM_MODAL",
    }),
    updateCategoryForm: (data: Partial<CategoryFormData>): ToolboxAction => ({
        type: "UPDATE_CATEGORY_FORM",
        payload: data,
    }),
    updateItemForm: (data: Partial<ItemFormData>): ToolboxAction => ({
        type: "UPDATE_ITEM_FORM",
        payload: data,
    }),
    setIconSearch: (query: string): ToolboxAction => ({
        type: "SET_ICON_SEARCH",
        payload: query,
    }),
    toggleIconSearch: (show: boolean): ToolboxAction => ({
        type: "TOGGLE_ICON_SEARCH",
        payload: show,
    }),
    selectTechStack: (tech: { name: string; iconName: string; color: string }): ToolboxAction => ({
        type: "SELECT_TECH_STACK",
        payload: tech,
    }),
};
