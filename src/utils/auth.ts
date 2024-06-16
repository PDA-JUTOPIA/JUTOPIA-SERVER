import jwt from "jsonwebtoken";

interface VisibleUser {
  user_id: number;
  email: string;
  // 다른 필요한 필드들도 추가할 수 있음
}

export const createToken = (
  visibleUser: VisibleUser,
  maxAge = 60 * 60 * 24 * 3
) => {
  return jwt.sign(visibleUser, process.env.JWT_SECRET || "MyJWT", {
    expiresIn: maxAge,
  });
};

export const verifyToken = (_token: string) => {
  if (!_token) {
    return null;
  }
  const verifiedToken = jwt.verify(_token, process.env.JWT_SECRET || "MyJWT");
  return verifiedToken;
};
