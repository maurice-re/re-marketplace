import type { Request, Response } from "express";
import nodemailer from "nodemailer";


export default async function handler(req: Request, res: Response) {
  const { message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maurice@re.company",
      pass: process.env.EMAIL_PASS,
    },
  });
  const email = {
    from: "Maurice @ RE",
    to: "maurice@re.company, maddie@re.company, matt@re.company, avantika@re.company",
    subject: "Product Matching Quote Requested",
    text: message,
  };
  await transporter.sendMail(email).catch(e => console.log(e));

  res.send();
}
