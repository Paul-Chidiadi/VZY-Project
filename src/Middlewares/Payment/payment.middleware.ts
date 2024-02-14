import { Response, NextFunction } from "express";
import { body, check } from "express-validator";

export const paymentValidationRules = () => {
  return [
    body("amount").trim().notEmpty().withMessage("Amount can not be empty"),
  ];
};
