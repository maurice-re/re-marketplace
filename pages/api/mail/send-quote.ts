import type { Request, Response } from "express";
import nodemailer from "nodemailer";


export default async function handler(req: Request, res: Response) {
  const { message } = req.body;
  console.log(message)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maurice@re.company",
      pass: process.env.EMAIL_PASS,
    },
  });
  const email = {
    from: "Maurice @ RE",
    to: "maurice@re.company",
    subject: "New Quote Requested",
    text: message,
  };
  await transporter.sendMail(email).catch(e => console.log(e));

  res.send()
}
