const { Resend } = require("resend");
const config = require("../../configs");
const logger = require("../log/logger");

const resend = new Resend(config.RESEND_API_KEY);
const sendVerificationEmail = async (user, verificationToken) => {
  console.log("user", user);
  console.log("verificationToken", verificationToken);
  const verificationUrl = `${config.CLIENT_URL}/auth/verify-email?token=${verificationToken}`;
  console.log("verificationUrl", verificationUrl);
  try {
    await resend.emails.send({
      from: config.FROM_EMAIL,
      to: "mdsalahuddin46464@gmail.com" || user.email,
      subject: "Verify your email address",
      html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in ${config.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES} minutes.</p>
        `,
    });

    logger.info("sendVerificationEmail(): Verification email sent", {
      userId: user.id,
    });
  } catch (error) {
    logger.error(
      "sendVerificationEmail(): Failed to send verification email",
      error
    );
    throw new AppError("Email Error", "Failed to send verification email", 500);
  }
};

module.exports = { sendVerificationEmail };
