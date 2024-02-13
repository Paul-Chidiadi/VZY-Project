import { Request, Response, NextFunction } from "express";
import AppError from "../../Utilities/Errors/appError";
import AuthRepository from "../../Repository/Auth/auth.repository";
import UserRepository from "../../Repository/Users/user.repository";
import { IUser } from "../../Models/Users/user.model";
import Utilities, { statusCode } from "../../Utilities/utils";

const authRepository = new AuthRepository();
const util = new Utilities();
const userRepository = new UserRepository();

export default class AuthService {
  public async updateUser(req: any, next: NextFunction): Promise<IUser | void> {
    //Here is my authenticated user information passed from authentication middlware
    const userData = req.user;

    if (Object.keys(userData).length !== 0) {
      //GET USERS EXISTING INFORMATION
      const usersExistingInformation: any = await userRepository.findUserById(
        userData.id
      );
      if (Object.keys(usersExistingInformation).length === 0) {
        return next(new AppError("user not found", statusCode.notFound()));
      }
      const payload: any = {
        ...req.body,
      };
      //update users data
      const user: any = await userRepository.findUserByIdAndUpdate(
        userData._id,
        payload
      );
      return user;
    }
    return next(new AppError("Not authorized", statusCode.unauthorized()));
  }
}
