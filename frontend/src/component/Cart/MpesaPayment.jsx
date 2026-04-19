import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { Typography, TextField, Button, Avatar } from "@material-ui/core";
import { CURRENCY_SYMBOL } from "../../constants/currencyConstant";
import { initiateStkPush, clearErrors } from "../../actions/mpesaAction";
import { createOrder } from "../../actions/orderAction";
import { STK_PUSH_RESET } from "../../constants/mpesaConstants";
import { useHistory } from "react-router-dom";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import useStyles from "../User/LoginFromStyle";

const MpesaPayment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const classes = useStyles();
    const dispatch = useDispatch();
    const alert = useAlert();
    const history = useHistory();

    const [phone, setPhone] = useState("");
    const { error, success, loading, message } = useSelector((state) => state.stkPush);

    const submitHandler = (e) => {
        e.preventDefault();
        if (phone.length < 10) {
            alert.error("Please enter a valid phone number");
            return;
        }
        // Format phone to 254XXXXXXXXX if necessary
        let formattedPhone = phone;
        if (phone.startsWith("0")) formattedPhone = "254" + phone.slice(1);
        if (phone.startsWith("+")) formattedPhone = phone.slice(1);

        const data = {
            amount: orderInfo?.totalFinalPrice,
            phone: formattedPhone,
        };
        dispatch(initiateStkPush(data));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (success) {
            const order = {
                shippingInfo,
                orderItems: cartItems,
                itemsPrice: orderInfo.subTotal,
                taxPrice: orderInfo.gst,
                shippingPrice: orderInfo.shippingCharges,
                totalPrice: orderInfo.totalFinalPrice,
                paymentInfo: {
                    id: "MPESA_PENDING",
                    status: "M-Pesa Processing",
                }
            };
            dispatch(createOrder(order));
            alert.success("STK Push sent! Enter PIN on phone to complete.");
            dispatch({ type: STK_PUSH_RESET });
            history.push("/success");
        }
    }, [dispatch, error, alert, success, history, message, cartItems, orderInfo, shippingInfo]);

    return (
        <div className={classes.formContainer}>
            <MetaData title="M-Pesa Payment" />
            <form className={classes.form} onSubmit={submitHandler}>
                <Avatar className={classes.avatar}>
                    <PhoneIphoneIcon />
                </Avatar>
                <Typography variant="h5" component="h1" className={classes.heading}>
                    Lipa na M-Pesa
                </Typography>
                <Typography variant="body2" style={{ textAlign: "center", marginBottom: "20px" }}>
                    Amount to Pay: <b>{CURRENCY_SYMBOL}{orderInfo && orderInfo.totalFinalPrice}</b>
                </Typography>
                <TextField
                    label="M-Pesa Phone Number"
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="e.g. 254712345678"
                    className={classes.textField}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <Button
                    variant="contained"
                    className={classes.loginButton}
                    fullWidth
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Processing..." : `Pay Now`}
                </Button>
            </form>
        </div>
    );
};

export default MpesaPayment;