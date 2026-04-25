import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  secure: process.env.EMAIL_SECURE || false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const emailOptions = {
  from: process.env.EMAIL_USERNAME,
};
