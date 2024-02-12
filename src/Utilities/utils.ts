import bcrypt from "bcrypt";
import "dotenv/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserRepository from "../Repository/Users/user.repository";

const userRepository = new UserRepository();

export default class Utilities {
  private pepper = String(process.env.BCRYPT_PASSWORD);

  private saltRound = Number(process.env.SALT_ROUNDS);

  private accessToken = process.env.ACCESSTOKENSECRET as string;

  public async verifyJWT(token: string) {
    try {
      return {
        payload: jwt.verify(token, this.accessToken),
        expired: false,
      };
    } catch (error) {
      if ((error as Error).name === "TokenExpiredError") {
        return { payload: jwt.decode(token), expired: true };
      }
      throw error;
    }
  }

  public async generateHash(plainPassword: string): Promise<string> {
    const hash = await bcrypt.hash(plainPassword + this.pepper, this.saltRound);
    return hash;
  }

  async comparePassword(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    const result = await bcrypt.compare(password + this.pepper, hashPassword);
    return result;
  }

  async generateToken(email: string) {
    const accessTokenSecret = process.env.ACCESSTOKENSECRET as string;
    const refreshTokenSecret = process.env.REFRESHTOKENSECRET as string;
    const payload: any = await userRepository.findUserByEmail(email);
    const data = {
      id: payload._id,
      email: payload.email,
    };
    const accessToken = jwt.sign(data, accessTokenSecret, {
      expiresIn: "60s", //TOKEN EXPIRES IN ONE MINUTE
    });
    const refreshToken = jwt.sign(data, refreshTokenSecret, {
      expiresIn: "1d",
    });
    return Promise.resolve({ accessToken, refreshToken });
  }
}

export const statusCode = {
  ok() {
    return 200;
  },

  created() {
    return 201;
  },

  accepted() {
    return 202;
  },

  noContent() {
    return 204;
  },

  resetContent() {
    return 205;
  },

  partialContent() {
    return 206;
  },

  badRequest() {
    return 400;
  },

  unauthorized() {
    return 401;
  },

  paymentRequired() {
    return 402;
  },

  accessForbidden() {
    return 403;
  },

  notFound() {
    return 404;
  },

  methodNotAllowed() {
    return 405;
  },

  notAccepted() {
    return 406;
  },

  proxyAuthenticationRequired() {
    return 407;
  },

  requestTimeout() {
    return 408;
  },

  conflict() {
    return 409;
  },

  unprocessableEntity() {
    return 422;
  },

  internalServerError() {
    return 500;
  },

  notImplemented() {
    return 501;
  },

  badGateway() {
    return 502;
  },

  serviceUnavalaibleError() {
    return 503;
  },

  gatewayTimeout() {
    return 504;
  },
};
