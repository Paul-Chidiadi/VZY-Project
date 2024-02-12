import { Router } from "express";
import { signUpValidationRules } from "../../Middlewares/Auth/auth.middleware";
import { signUp } from "../../Controllers/Auth/auth.controller";
import validate from "../../Middlewares/reqValidation.middleware";

const router = Router();

router.post("/signUp", signUpValidationRules(), validate, signUp);

export default router;
