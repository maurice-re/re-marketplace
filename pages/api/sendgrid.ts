import sendgrid from "@sendgrid/mail";
import type { Request, Response } from 'express';


sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

async function sendEmail(req: Request, res : Response) {
  try {
    // console.log("REQ.BODY", req.body);
    console.log(req.body.msg)
    await sendgrid.send({
      to: "maurice@re.company", // Your email where you'll receive emails
      from: "maurice@re.company", // your website email address here
      subject: `Order Placed`,
      html: `<p>${req.body.msg}</p>`,
    });
  } catch (error) {
    console.log(error);
    if(error instanceof Error){
        return res.status(500).json({ error: error.message });
    }
  }

  console.log("success")
  return res.status(200).json({ error: "" });
}

export default sendEmail;