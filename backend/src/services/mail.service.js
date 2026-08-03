import brevo from "../config/brevo.js";
import ApiError from "../utils/ApiError.js";

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
}) => {
  try {
    await brevo.post("/smtp/email", {
      sender: {
        name: process.env.MAIL_FROM_NAME,
        email: process.env.MAIL_FROM_EMAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent,
    });
  } catch (error) {
    console.error(
      "Brevo Error:",
      error.response?.data || error.message
    );

    throw new ApiError(500, "Failed to send email.");
  }
};