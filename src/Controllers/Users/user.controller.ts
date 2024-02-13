import { Request, Response, NextFunction } from "express";
import UserService from "../../Services/Users/user.service";
import AppError from "../../Utilities/Errors/appError";
import { statusCode } from "../../Utilities/utils";

const userService = new UserService();

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.updateUser(req, next);
    if (user) {
      return res.status(statusCode.created()).json({
        status: "success",
        message: "Users record successfully updated",
        user,
      });
    }
  } catch (err) {
    return next(
      new AppError(
        `something went wrong ${err}`,
        statusCode.internalServerError()
      )
    );
  }
};
