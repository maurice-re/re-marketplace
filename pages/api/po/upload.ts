import { Request, Response } from "express";
import { customAlphabet } from "nanoid";

const AWS = require("aws-sdk");
const nanoid = customAlphabet("0123456789", 10);

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const s3DefaultParams = {
    ACL: "public-read",
    Bucket: process.env.S3_BUCKET_NAME,
    Conditions: [
        ["content-length-range", 0, 1024000], // 1 Mb
        { acl: "public-read" },
    ],
};

async function handleFileUpload(file: any) {
    return new Promise((resolve, reject) => {
        s3.upload(
            {
                ...s3DefaultParams,
                Key: nanoid() + ".pdf",
                ContentType: "application/pdf",
                Body: file,
                ContentEncoding: "base64",
            },
            (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }
        );
    });
}

async function upload(req: Request, res: Response) {
    if (req.method != "POST") {
        res.status(400).send();
        return;
    }

    const base64 = req.body;
    const base64Data = Buffer.from(base64.replace(/^data:application\/\w+;base64,/, ""), "base64");

    const response: any = await handleFileUpload(base64Data);

    const url = response.Location;

    res.status(200).json({ message: url });

}
export default upload;