const express = require("express");
const { stkPush, mpesaCallback } = require("../controller/mpesaController");
const { isAuthentictedUser } = require("../middleWare/auth");

const router = express.Router();

router.route("/mpesa/stkpush").post(isAuthentictedUser, stkPush);
router.route("/mpesa/callback").post(mpesaCallback);

module.exports = router;