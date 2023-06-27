import type { Request, Response } from "express";
import nodemailer from "nodemailer";


export default async function handler(req: Request, res: Response) {
  const { email, message }: {email: string, message: string} = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maurice@re.company",
      pass: process.env.EMAIL_PASS,
    },
  });
  const requestedQuote = {
    from: "Shop @ Re Company <maurice@re.company",
    to: "maurice@re.company, maddie@re.company",
    subject: "Product Quote Requested",
    text: `Product Quote request by: ${email} \nProducts Requested: \n ${message}`,
  };
  await transporter.sendMail(requestedQuote).catch(e => console.log(e));

  const emailToCustomer = {
    from: "Shop @ Re Company <maurice@re.company>",
    to: email,
    subject: "Your Quote Is Being Processed",
    text: "Thank you for your interest in our products. We will get back to you shortly.",
  };

  await transporter.sendMail(emailToCustomer).catch(e => console.log(e));

  res.send();
}
