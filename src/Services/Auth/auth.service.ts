import { Request, Response, NextFunction } from "express";
import AppError from "../../Utilities/Errors/appError";
import AuthRepository from "../../Repository/Auth/auth.repository";
import UserRepository from "../../Repository/Users/user.repository";
import { IUser } from "../../Models/Users/user.model";
import Utilities, { statusCode } from "../../Utilities/utils";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const util = new Utilities();

export default class AuthService {
  public async signUp(req: any, next: NextFunction): Promise<IUser | void> {
    const { fullName, password, email, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return next(
        new AppError("passwords do not match", statusCode.badRequest())
      );
    }
    const userExist = await userRepository.findUserByEmail(email);
    if (userExist === null) {
      const hashPassword = await util.generateHash(password);
      const user: IUser = {
        fullName,
        email,
        password: hashPassword,
      };

      const data = await authRepository.signUp(user);
      const newUser = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
      };
      if (data) {
        //WE CAN GENERATE AND SEND AN OTP TO USER EMAIL TO ACTIVATE AND CONFIRM EMAIL BUT THAT PROCESS IS NOT LISTED IN THE TASK
        return newUser as IUser;
      }
    }
    return next(
      new AppError("Email address already exist", statusCode.conflict())
    );
  }
}
