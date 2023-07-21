import { NextApiRequest, NextApiResponse } from 'next';
import S3 from 'aws-sdk/clients/s3';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // switch (req.method) {
    // case "POST":
      try {
        console.log('##########');
        console.log(req.body);
        
        // TODO: Check files have been passed as an array
        if (!Array.isArray(req.body.files)) {
          console.log("files are not in array");
          return res.status(400).json({ error: 'Files must be an array' });
        }
        
        const files: File[] = req.body.files;
        for (const file of files) {
          // TODO send to bucket
          await sendToBucket(file);
        }
        console.log("sent each file to bucket");
      console.log("sent each file to bucket");
      console.log('Uploaded images!');

      res.status(200).json({ message: 'Images uploaded successfully' });
      }
      catch (err) {
        console.log('Error in uploading images!', err);
        res.status(500).json({ error: 'Failed to upload images' });
      }

}

async function sendToBucket(file: File) {
  try {
    console.log("sendToBucket");
    console.log("fileParams");
    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.name,
      ContentType: file.type,
    };
    console.log("new S3 object");
    const s3 = new S3({
      region: "ap-southeast-2",
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      signatureVersion: 'v4',
    });
    console.log("signed url promise");
    const url = await s3.getSignedUrlPromise('putObject', fileParams);

    
    console.log("url", url as string);
    return url;
  } catch (err) {
    console.log('Error in uploading image!');
    throw err;
  }
}