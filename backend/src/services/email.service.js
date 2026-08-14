import { renderTemplate } from "../utils/template.js";
import { sendEmail } from "./mail.service.js";

export const sendWelcomeEmail = async (user) => {
  const html = await renderTemplate("welcome", {
    name: user.name,
    appUrl: process.env.APP_URL,
    year: new Date().getFullYear().toString(),
  });

  await sendEmail({
    to: user.email,
    subject: "Welcome to DevLupo 🚀",
    htmlContent: html,
  });
};

export const sendForgotPasswordEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const html = await renderTemplate("forgot-password", {
    name: user.name,
    resetUrl,
    year: new Date().getFullYear().toString(),
  });

  await sendEmail({
    to: user.email,
    subject: "Reset your DevLupo password",
    htmlContent: html,
  });
};

export const sendPasswordChangedEmail = async (user) => {
  const html = await renderTemplate("password-changed", {
    name: user.name,
    year: new Date().getFullYear().toString(),
  });

  await sendEmail({
    to: user.email,
    subject: "Your password has been changed",
    htmlContent: html,
  });
};
