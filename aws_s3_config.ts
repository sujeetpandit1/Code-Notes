import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

export const uploadImageToS3 = async (file: Express.Multer.File) => {
  try {
    const fileName = file.originalname.split(".").slice(-1)[0];
    const fileKey = `${fileName}-${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: process.env.BUCKET as string,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);

    const presignedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: process.env.BUCKET as string,
        Key: fileKey,
      })
    );
    const baseUrl = presignedUrl.split("?")[0];

    return baseUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
