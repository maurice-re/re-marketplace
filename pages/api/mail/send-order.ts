import type { Request, Response } from "express";
import nodemailer from "nodemailer";


export default async function handler(req: Request, res: Response) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maurice@re.company",
      pass: process.env.EMAIL_PASS,
    },
  });
  const email = {
    from: "Re Platform",
    to: "maurice@re.company, maddie@re.company, matt@re.company, avantika@re.company, suhana@re.company",
    subject: "A new order was placed!",
    text: "Check retool for more details https://recompany.retool.com/apps/2f02a446-5301-11ed-8842-374317c263f0/Orders",
  };
  await transporter.sendMail(email).catch(e => console.log(e));

  res.send();
}
