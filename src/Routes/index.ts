import { Router } from "express";
import authRoute from "./Auth/auth.route";
import userRoute from "./Users/user.route";
import paymentRoute from "./Payment/payment.routes";

const router = Router();

// authentication routes
router.use("/auth", authRoute);

// users routes
router.use("/user", userRoute);

//Payment routes
router.use("/payment", paymentRoute);

export default router;
