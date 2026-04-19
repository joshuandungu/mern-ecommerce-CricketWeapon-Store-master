const axios = require("axios");
const asyncWrapper = require("../middleWare/asyncWrapper");
const ErrorHandler = require("../utils/errorHandler");
const Order = require("../model/orderModel");

// Helper to get OAuth Token
const getAccessToken = async (next) => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    try {
        const { data } = await axios.get(url, {
            headers: { Authorization: `Basic ${auth}` },
        });
        return data.access_token;
    } catch (error) {
        throw new ErrorHandler("M-Pesa Authentication Failed: " + (error.response?.data?.errorMessage || error.message), 500);
    }
};

// Initiate STK Push
exports.stkPush = asyncWrapper(async (req, res, next) => {
    let { amount, phone } = req.body;

    if (!phone || !amount) {
        return next(new ErrorHandler("Phone and amount are required", 400));
    }

    // Sanitize phone number to 2547XXXXXXXX format
    phone = phone.replace("+", "");
    if (phone.startsWith("0")) phone = "254" + phone.slice(1);
    if (phone.startsWith("7")) phone = "254" + phone;

    const token = await getAccessToken(next);
    const date = new Date();
    const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

    const stkUrl = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const requestBody = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "Aura_Fashion",
        TransactionDesc: "Payment for order",
    };

    try {
        const { data } = await axios.post(stkUrl, requestBody, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.status(200).json({ success: true, data });
    } catch (error) {
        return next(new ErrorHandler(error.response?.data?.errorMessage || "STK Push Failed", 500));
    }
});

// M-Pesa Callback
exports.mpesaCallback = asyncWrapper(async (req, res) => {
    const { Body } = req.body;
    if (!Body || !Body.stkCallback) {
        return res.status(400).json({ message: "Invalid Callback Data" });
    }

    const { stkCallback } = Body;
    const resultCode = stkCallback.ResultCode;
    const checkoutRequestID = stkCallback.CheckoutRequestID;

    console.log(`M-Pesa Callback received. ID: ${checkoutRequestID}, Result: ${resultCode}`);

    // ResultCode 0 indicates a successful transaction in Safaricom's API
    if (resultCode === 0) {
        // Find the order that was saved with this specific CheckoutRequestID
        const order = await Order.findOne({ "paymentInfo.id": checkoutRequestID });

        if (order) {
            order.paymentInfo.status = "succeeded";
            order.paidAt = Date.now();
            order.orderStatus = "Paid";
            await order.save({ validateBeforeSave: false });
            console.log(`Order ${order._id} successfully updated to Paid.`);
        } else {
            console.log(`Order with CheckoutRequestID ${checkoutRequestID} not found.`);
        }
    }

    // Safaricom requires a specific JSON response to acknowledge receipt of the callback
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
});