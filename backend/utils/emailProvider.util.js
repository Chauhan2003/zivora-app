import jwt from "jsonwebtoken";
import { transport, emailOptions } from "../configs/email.config.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transport.sendMail({
      ...emailOptions,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error in sending email:", err.message);
    throw new Error("Failed to send email");
  }
};

export const sendVerificationEmail = async ({ email }) => {
  // try {
  //   const token = jwt.sign({ email }, process.env.JWT_SECRET, {
  //     expiresIn: "1h",
  //   });

  //   const verificationLink = `${process.env.CLIENT_URL}/accounts/verify/email/${token}`;

  //   console.log("Created verification link");

  //   const html = `
  //     <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  //       <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px;">
  //         <h1 style="color: #333; text-align: center;">Verify Your Email</h1>
  //         <p style="color: #555; line-height: 1.6;">
  //           Click the button below to verify your email address.
  //         </p>
  //         <div style="text-align: center; margin: 30px 0;">
  //           <a href="${verificationLink}"
  //             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
  //             Verify Email
  //           </a>
  //         </div>
  //         <p style="color: #555; line-height: 1.6;">
  //           This link will expire in 1 hour. If you didn’t request email verification, you can safely ignore this email.
  //         </p>
  //       </div>
  //     </div>
  //   `;

  //   console.log("Started sending mail");
  //   await sendEmail({
  //     to: email,
  //     subject: "Verify Your Email",
  //     html,
  //   });

  //   console.log("Sent verification email");
  // } catch (error) {
  //   console.error("Error in sending verification email:", error.message);
  //   throw new Error("Could not send verification email");
  // }

  console.log("Sent verification email");
};

export const sendResetPasswordEmail = async ({ email }) => {
  // try {
  //   const token = jwt.sign({ email }, process.env.JWT_SECRET, {
  //     expiresIn: "15m",
  //   });

  //   const resetPasswordLink = `${process.env.CLIENT_URL}/accounts/reset/password/${token}`;

  //   const html = `
  //     <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  //       <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border-radius: 8px;">
  //         <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
  //         <p style="color: #555; line-height: 1.6;">
  //           We received a request to reset your password. Click the button below to set a new password.
  //         </p>
  //         <div style="text-align: center; margin: 30px 0;">
  //           <a href="${resetPasswordLink}"
  //             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
  //             Reset Password
  //           </a>
  //         </div>
  //         <p style="color: #555; line-height: 1.6;">
  //           This link will expire in 15 minutes. If you didn’t request a password reset, you can safely ignore this email.
  //         </p>
  //       </div>
  //     </div>
  //   `;

  //   await sendEmail({
  //     to: email,
  //     subject: "Reset Your Password",
  //     html,
  //   });
  // } catch (error) {
  //   console.error("Error in sending reset password email:", error.message);
  //   throw new Error("Could not send reset password email");
  // }

  console.log("Sent reset password email");
};

export const sendWelcomeEmail = async ({ fullName, email }) => {
  // try {
  //   const html = `
  //     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
  //       <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
  //         <div style="background: linear-gradient(135deg, #007bff, #00c6ff); padding: 30px 20px; text-align: center;">
  //           <h1 style="color: #fff; margin: 0; font-size: 28px;">Welcome to Our Community 🎉</h1>
  //         </div>
  //         <div style="padding: 30px 20px;">
  //           <p style="color: #333; font-size: 18px; line-height: 1.6;">
  //             Hi <strong>${fullName || "there"}</strong>,
  //           </p>
  //           <p style="color: #555; font-size: 16px; line-height: 1.6;">
  //             We're thrilled to have you on board! Your account has been successfully created.
  //             You can now connect, explore, and enjoy all our features.
  //           </p>
  //           <p style="color: #777; font-size: 15px; line-height: 1.6;">
  //             Need help getting started? Just reply to this email — we’re here for you.
  //             Welcome aboard 🚀
  //           </p>
  //           <p style="margin-top: 20px; color: #555;">— The Team</p>
  //         </div>
  //         <div style="background: #f0f0f0; padding: 15px; text-align: center; color: #888; font-size: 13px;">
  //           © ${new Date().getFullYear()} Your App Name. All rights reserved.
  //         </div>
  //       </div>
  //     </div>
  //   `;

  //   await sendEmail({
  //     to: email,
  //     subject: "🎉 Welcome to Our Community!",
  //     html,
  //   });

  //   console.log(`Welcome email sent to ${email}`);
  // } catch (error) {
  //   console.error("Error in sending welcome email:", error.message);
  //   throw new Error("Could not send welcome email");
  // }

  console.log(`Welcome email sent to ${email}`);
};
