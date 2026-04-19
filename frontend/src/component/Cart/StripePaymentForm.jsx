import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { CURRENCY_SYMBOL } from "../../constants/currencyConstant";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Typography, TextField, Button } from "@material-ui/core";
import { CreditCard, Event as EventIcon, VpnKey as VpnKeyIcon } from "@material-ui/icons";
import useStyles from "../User/LoginFromStyle"; // Assuming this is used for styling

const StripePaymentForm = () => {
    const classes = useStyles();
    const history = useHistory();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.userData);
    const { error } = useSelector((state) => state.newOrder);

    const [nameOnCard, setNameOnCard] = useState("");

    const paymentData = {
        amount: Math.round(orderInfo?.totalFinalPrice * 100),
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo?.subTotal,
        taxPrice: orderInfo?.gst,
        shippingPrice: orderInfo?.shippingCharges,
        totalPrice: orderInfo?.totalFinalPrice,
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            alert.error("Stripe is not loaded. Please try again.");
            return;
        }
        if (nameOnCard === "") {
            alert.error("Please enter name on card");
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/v1/payment/process",
                paymentData,
                config
            );

            const client_secret = data.client_secret;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country, // Use actual country from shippingInfo
                        },
                    },
                },
            });

            if (result.error) {
                alert.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: "succeeded",
                    };
                    dispatch(createOrder(order));
                    history.push("/success");
                } else {
                    alert.error("There's some issue while processing payment");
                }
            }
        } catch (error) {
            alert.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (!orderInfo) {
            history.push("/cart");
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, orderInfo, history]);

    return (
        <form className="paymentForm" onSubmit={submitHandler}>
            <Typography variant="h6" style={{ marginBottom: "15px" }}>Card Info</Typography>
            <div>
                <CreditCard />
                <CardNumberElement className="paymentInput" />
            </div>
            <div>
                <EventIcon />
                <CardExpiryElement className="paymentInput" />
            </div>
            <div>
                <VpnKeyIcon />
                <CardCvcElement className="paymentInput" />
            </div>
            <TextField label="Name on Card" variant="outlined" fullWidth value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} required className={classes.textField} />
            <Button type="submit" variant="contained" className="paymentFormBtn">
                Pay - {CURRENCY_SYMBOL}{orderInfo?.totalFinalPrice}
            </Button>
        </form>
    );
};

export default StripePaymentForm;