import { Router } from "express";
import { updateUserValidationRules } from "../../Middlewares/Users/user.middleware";
import { updateUser } from "../../Controllers/Users/user.controller";
import validate from "../../Middlewares/reqValidation.middleware";

//Middleware for authentication to ensure routes are accessbile by authorized user
import { authenticate } from "../../Middlewares/verifyToken.middleware";

const router = Router();

router.patch(
  "/",
  updateUserValidationRules(),
  validate,
  authenticate,
  updateUser
);

export default router;
