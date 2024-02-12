import { User, IUser } from "../../Models/Users/user.model";

export default class UserRepository {
  async findOneUser(id: string): Promise<IUser | null> {
    const user: any = await User.findOne({ _id: id }).lean();
    return user as IUser;
  }

  async findUserById(userId: string): Promise<IUser | null> {
    const user: any = await User.findById(userId);
    return user as IUser;
  }

  async findUserByEmail(userEmail: string): Promise<IUser | null> {
    const result: any = await User.findOne({
      email: userEmail,
    }).exec();
    return result;
  }

  async findUserByIdAndUpdate(
    id: string,
    payload: IUser
  ): Promise<IUser | null> {
    const user: any = await User.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
    }).exec();
    return user as IUser;
  }
}
