const isProduction = process.env.NODE_ENV === "production";

const sameSite = isProduction ? "none" : "lax";

export const accessCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite,
  maxAge: 15 * 60 * 1000,
  path: "/",
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};