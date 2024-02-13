import { Router } from "express";
import {
  signUpValidationRules,
  loginValidationRules,
} from "../../Middlewares/Auth/auth.middleware";
import { signUp, login } from "../../Controllers/Auth/auth.controller";
import validate from "../../Middlewares/reqValidation.middleware";

const router = Router();

router.post("/signUp", signUpValidationRules(), validate, signUp);
router.post("/login", loginValidationRules(), validate, login);

export default router;
