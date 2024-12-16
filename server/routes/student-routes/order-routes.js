const express = require("express");
const {
  getAccessToken,
} = require("../../controllers/student-controller/order-controller");
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture_payment", capturePaymentAndFinalizeOrder);
module.exports = router;
