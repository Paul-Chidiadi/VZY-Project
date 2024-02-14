import express, { Router } from "express";
const router = Router();

import {
  createPaymentIntent,
  stripeWebhook,
} from "../../Controllers/Payment/stripe.controllers";
import { paymentValidationRules } from "../../Middlewares/Payment/payment.middleware";
import validate from "../../Middlewares/reqValidation.middleware";
import { authenticate } from "../../Middlewares/verifyToken.middleware";

router
  .route("/createPaymentIntent")
  .post(paymentValidationRules(), validate, authenticate, createPaymentIntent);

router
  .route("/stripe/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);

export default router;
