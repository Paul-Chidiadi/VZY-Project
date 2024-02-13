import { Response, NextFunction } from "express";
import { body, check } from "express-validator";

export const updateUserValidationRules = () => {
  return [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Full Name can not be empty"),
  ];
};
