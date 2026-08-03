import crypto from "crypto";

const RESET_TOKEN_BYTES = 32;

export const generateResetToken = () => {
  return crypto
    .randomBytes(RESET_TOKEN_BYTES)
    .toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};