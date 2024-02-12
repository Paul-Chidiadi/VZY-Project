import { Router } from "express";
import authRoute from "./Auth/auth.route";

const router = Router();

// authentication routes
router.use("/auth", authRoute);

export default router;
