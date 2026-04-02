import React, { useState, useEffect } from "react";
import CheckoutSteps from "./CheckoutSteps ";
import MetaData from "../layouts/MataData/MataData";
import {
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Container,
    Paper,
    Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { createOrder, clearErrors } from "../../actions/orderAction";
import "./Cart.css";

const useStyles = makeStyles((theme) => ({
    paymentPaper: {
        padding: theme.spacing(4),
        borderRadius: "16px",
        boxShadow: "0px 10px 40px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
        backgroundColor: "#ffffff",
    },
    heading: {
        marginBottom: theme.spacing(4),
        fontWeight: 800,
        textAlign: "center",
        color: "#1a1a1a",
        textTransform: "uppercase",
        letterSpacing: "1px",
    },
    paymentOption: {
        width: "100%",
        margin: "12px 0 !important",
        padding: "15px 20px",
        borderRadius: "12px",
        border: "1px solid #eeeeee",
        transition: "all 0.3s ease",
        "&:hover": {
            borderColor: "#E30613",
            backgroundColor: "rgba(227, 6, 19, 0.02)",
        },
    },
    submitButton: {
        marginTop: theme.spacing(4),
        width: "100%",
        backgroundColor: "#E30613",
        color: "#FFFFFF",
        padding: "15px",
        borderRadius: "10px",
        fontWeight: 700,
        fontSize: "1rem",
        transition: "all 0.3s ease",
        "&:hover": {
            backgroundColor: "#b2050f",
            transform: "translateY(-2px)",
            boxShadow: "0px 8px 20px rgba(227, 6, 19, 0.3)",
        },
    },
}));

const PaymentOptions = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const alert = useAlert();

    const [paymentMethod, setPaymentMethod] = useState("card");
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { error } = useSelector((state) => state.newOrder);

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo?.subTotal,
        taxPrice: orderInfo?.gst,
        shippingPrice: orderInfo?.shippingCharges,
        totalPrice: orderInfo?.totalFinalPrice,
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (paymentMethod === "card") {
            history.push("/process/payment/stripe");
        } else if (paymentMethod === "mpesa") {
            history.push("/process/payment/mpesa");
        } else if (paymentMethod === "cod") {
            order.paymentInfo = {
                id: "CASH_ON_DELIVERY",
                status: "Cash on Delivery",
            };
            dispatch(createOrder(order));
            history.push("/success");
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
    }, [dispatch, alert, error, history, orderInfo]);

    if (!orderInfo) return null;

    return (
        <>
            <MetaData title="Payment Options" />
            <CheckoutSteps activeStep={2} />
            <Container maxWidth="sm" style={{ paddingBottom: "100px", marginTop: "2rem" }}>
                <Paper className={classes.paymentPaper} elevation={0}>
                    <form onSubmit={submitHandler}>
                        <Typography variant="h5" className={classes.heading}>
                            Payment Method
                        </Typography>

                        <RadioGroup
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <FormControlLabel
                                value="card"
                                className={classes.paymentOption}
                                control={<Radio color="primary" />}
                                label={
                                    <Typography style={{ fontWeight: 500 }}>
                                        Credit / Debit Card (Stripe)
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                value="mpesa"
                                className={classes.paymentOption}
                                control={<Radio color="primary" />}
                                label={
                                    <Typography style={{ fontWeight: 500 }}>
                                        Lipa na M-Pesa
                                    </Typography>
                                }
                            />
                            <FormControlLabel
                                value="cod"
                                className={classes.paymentOption}
                                control={<Radio color="primary" />}
                                label={
                                    <Typography style={{ fontWeight: 500 }}>
                                        Cash on Delivery
                                    </Typography>
                                }
                            />
                        </RadioGroup>

                        <Button
                            variant="contained"
                            className={classes.submitButton}
                            type="submit"
                        >
                            {paymentMethod === "cod" ? "Place Order" : "Continue to Pay"}
                            &nbsp; - ₹{orderInfo?.totalFinalPrice}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </>
    );
};

export default PaymentOptions;