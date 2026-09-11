import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { envs } from '../enviroments.js';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${envs.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: envs.R2_ACCESS_KEY_ID,
    secretAccessKey: envs.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = envs.R2_BUCKET_NAME;

export class R2Storage {
  async uploadFile(fileBuffer, fileName, contentType) {
    const key = `designs/${crypto.randomUUID()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    return {
      key,
      url: `${envs.R2_PUBLIC_URL}/${key}`,
    };
  }

  async uploadPreview(fileBuffer, fileName) {
    const key = `previews/${crypto.randomUUID()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: 'image/jpeg',
    });

    await s3Client.send(command);

    return {
      key,
      url: `${envs.R2_PUBLIC_URL}/${key}`,
    };
  }

  async getSignedDownloadUrl(key, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  async deleteFile(key) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    await s3Client.send(command);
  }
}

export const r2Storage = new R2Storage();
