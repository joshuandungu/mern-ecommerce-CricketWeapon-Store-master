import {
    STK_PUSH_REQUEST,
    STK_PUSH_SUCCESS,
    STK_PUSH_FAIL,
    STK_PUSH_RESET,
    CLEAR_ERRORS,
} from "../constants/mpesaConstants";

export const mpesaReducer = (state = {}, action) => {
    switch (action.type) {
        case STK_PUSH_REQUEST:
            return {
                loading: true,
            };
        case STK_PUSH_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                message: action.payload.data.CustomerMessage,
            };
        case STK_PUSH_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case STK_PUSH_RESET:
            return {
                ...state,
                success: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};