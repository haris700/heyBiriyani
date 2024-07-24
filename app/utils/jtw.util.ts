import jwt, { JwtPayload } from "jsonwebtoken";

const JWT = {
  jwt: process.env.JWT_SECRET || "defaultSecret",
  jwtExp: "6h",
};

export const createToken = (uid: string): string => {
  if (!JWT.jwt) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign({ uid }, JWT.jwt, { expiresIn: JWT.jwtExp });
};

export const verifyToken = (
  token: string
): { uid: string; expired: boolean } => {
  if (!JWT.jwt) {
    throw new Error("JWT secret is not defined");
  }

  try {
    const data = jwt.verify(token, JWT.jwt) as JwtPayload & { uid: string };

    if (!data.uid) {
      throw new Error("Invalid token payload");
    }

    const now = Date.now() / 1000;

    return {
      uid: data.uid,
      expired: now >= data.exp!,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      uid: "",
      expired: true,
    };
  }
};
