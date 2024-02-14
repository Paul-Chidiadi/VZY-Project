import { Request, Response, NextFunction } from "express";
import { Stripe } from "stripe";
import AppError from "../../Utilities/Errors/appError";
import { statusCode } from "../../Utilities/utils";
import UserRepository from "../../Repository/Users/user.repository";

const userRepository = new UserRepository();

export default class stripeService {
  private STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  private ENDPOINT_SECRET = process.env.ENDPOINT_SECRET;

  public async createPaymentIntent(
    req: Request,
    next: NextFunction
  ): Promise<any> {
    const { id, email } = req.user;
    const { amount } = req.body;
    if (id) {
      const items = req.body
        .items as Stripe.Checkout.SessionCreateParams.LineItem[];
      const stripe = new Stripe(this.STRIPE_SECRET_KEY as string);

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), //my amount in cents,
          currency: "usd",
          metadata: {
            amount: Math.round(amount * 100), //Specifying my amount in cents
            userId: id,
            userEmail: email,
          },
        });

        return { clientSecret: paymentIntent.client_secret };
      } catch (err) {
        return next(
          new AppError(
            `Error creating PaymentIntent ${err}`,
            statusCode.internalServerError()
          )
        );
      }
    }
    return next(
      new AppError("please login to gain access", statusCode.unauthorized())
    );
  }

  //MY FUNCTION FOR UPDATING USERS STATUS TO PAID
  async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const userId = paymentIntent.metadata.userId;
    // Update user status to "paid" in the database
    const payload: any = {
      status: "paid",
    };
    //update users data
    const user: any = await userRepository.findUserByIdAndUpdate(
      userId,
      payload
    );
    return user;
  }

  public async stripeWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const stripe = new Stripe(this.STRIPE_SECRET_KEY as string);
    const sig = req.headers["stripe-signature"] as string;
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        this.ENDPOINT_SECRET as string
      );
    } catch (err) {
      return next(
        new AppError(`Webhook Error: ${err}`, statusCode.badRequest())
      );
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data
          .object as Stripe.PaymentIntent;
        // Process the successful transaction to update users status to paid
        this.handlePaymentSuccess(paymentIntentSucceeded);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  }
}
