import { Request, Response, NextFunction } from "express";
import StripeService from "../../Services/Payment/stripe.services";
import AppError from "../../Utilities/Errors/appError";
import { statusCode } from "../../Utilities/utils";

const stripeService = new StripeService();

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await stripeService.createPaymentIntent(req, next);
    if (payment) {
      return res.status(statusCode.created()).json({
        status: true,
        message: "Payment Initialized",
        data: {
          payment,
        },
      });
    }
  } catch (err) {
    return next(
      new AppError(
        `something went wrong! please try again later ${err}`,
        statusCode.internalServerError()
      )
    );
  }
};

export const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await stripeService.stripeWebhook(req, res, next);
    return payment;
  } catch (err) {
    return next(
      new AppError(
        `something went wrong! please try again later ${err}`,
        statusCode.internalServerError()
      )
    );
  }
};
