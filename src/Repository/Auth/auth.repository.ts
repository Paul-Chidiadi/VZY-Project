import { User, IUser } from "../../Models/Users/user.model";

export default class AuthRepository {
  async signUp(payload: IUser): Promise<IUser> {
    const user: any = await User.create(payload);
    return user as IUser;
  }
}
