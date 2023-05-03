import type { Request, Response } from "express";
import nodemailer from "nodemailer";

// TODO(Suhana): Combine all emailers into one function
export default async function handler(req: Request, res: Response) {
    const { to, orderId, status } = req.body;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "maurice@re.company",
            pass: process.env.EMAIL_PASS,
        },
    });

    const emailToCustomer = {
        from: "Re Platform",
        to: to,
        subject: "Update to Your Order",
        text: "Order #" + orderId + " is now " + status + ".",
    };
    await transporter.sendMail(emailToCustomer).catch(e => console.log(e));

    res.send();
}
