import type { Request, Response } from "express";
import nodemailer from "nodemailer";

export default async function handler(req: Request, res: Response) {
  const { url } = req.body;

  if (!url || typeof url != "string") {
    res.send(400);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maurice@re.company",
      pass: process.env.EMAIL_PASS,
    },
  });
  const email = {
    from: "Re Platform",
    to: "suhana@re.company",
    subject: "A new PO was generated!",
    text: "View PO here: " + url,
  };
  await transporter.sendMail(email).catch(e => console.log(e));

  res.send(200);
}
