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

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<IUser | void> {
    const { email, password } = req.body;
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      return next(
        new AppError(
          "Incorrect Email or password",
          statusCode.unprocessableEntity()
        )
      );
    }
    //Compare passowrds
    const hashedPassword = await util.comparePassword(password, user.password);
    if (hashedPassword) {
      const { accessToken, refreshToken } = await util.generateToken(
        user.email
      );
      // We can chooose to send a mail to the user email on successful login attempt
      res.status(statusCode.accepted()).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user,
      });
    } else {
      return next(
        new AppError("Incorrect password", statusCode.accessForbidden())
      );
    }
  }
}
