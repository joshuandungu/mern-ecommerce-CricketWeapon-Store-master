import API from "../apiConfig";
import {
    ALL_CATEGORIES_REQUEST,
    ALL_CATEGORIES_SUCCESS,
    ALL_CATEGORIES_FAIL,
    NEW_CATEGORY_REQUEST,
    NEW_CATEGORY_SUCCESS,
    NEW_CATEGORY_FAIL,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAIL,
    CLEAR_ERRORS,
} from "../constants/categoryConstants";

// Get All Categories
export const getAllCategories = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_CATEGORIES_REQUEST });
        const { data } = await API.get("/api/v1/categories");
        dispatch({
            type: ALL_CATEGORIES_SUCCESS,
            payload: data.categories,
        });
    } catch (error) {
        dispatch({
            type: ALL_CATEGORIES_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Create Category -- Admin
export const createCategory = (categoryData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_CATEGORY_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await API.post(
            `/api/v1/admin/category/new`,
            categoryData,
            config
        );
        dispatch({
            type: NEW_CATEGORY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: NEW_CATEGORY_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update Category -- Admin
export const updateCategory = (id, categoryData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_CATEGORY_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await API.put(
            `/api/v1/admin/category/${id}`,
            categoryData,
            config
        );
        dispatch({
            type: UPDATE_CATEGORY_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_CATEGORY_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Delete Category -- Admin
export const deleteCategory = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_CATEGORY_REQUEST });
        const { data } = await API.delete(`/api/v1/admin/category/${id}`);
        dispatch({
            type: DELETE_CATEGORY_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: DELETE_CATEGORY_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};