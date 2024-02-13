import { Router } from "express";
import authRoute from "./Auth/auth.route";
import userRoute from "./Users/user.route";

const router = Router();

// authentication routes
router.use("/auth", authRoute);

// users routes
router.use("/user", userRoute);

export default router;
