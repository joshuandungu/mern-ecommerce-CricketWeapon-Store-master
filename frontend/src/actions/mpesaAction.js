import axios from "axios";
import {
    STK_PUSH_REQUEST,
    STK_PUSH_SUCCESS,
    STK_PUSH_FAIL,
    CLEAR_ERRORS,
} from "../constants/mpesaConstants";

export const initiateStkPush = (paymentData) => async (dispatch) => {
    try {
        dispatch({ type: STK_PUSH_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post("/api/v1/mpesa/stkpush", paymentData, config);

        dispatch({
            type: STK_PUSH_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: STK_PUSH_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};