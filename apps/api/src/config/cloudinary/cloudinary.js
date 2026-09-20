import { v2 as cloudinary } from 'cloudinary';
import { envs } from '../enviroments.js';

cloudinary.config({
  cloud_name: envs.CLOUDINARY_CLOUD_NAME,
  api_key: envs.CLOUDINARY_API_KEY,
  api_secret: envs.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorage {
  async uploadPreview(fileBuffer, fileName) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'market-design/previews',
          public_id: `preview-${Date.now()}-${fileName.split('.')[0]}`,
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  }

  getPreviewUrl(publicId, options = {}) {
    const transformations = [];

    // Add watermark for public display
    if (options.watermark) {
      transformations.push({
        overlay: 'market-design-watermark',
        opacity: 30,
        gravity: 'center',
      });
    }

    // Resize
    if (options.width || options.height) {
      transformations.push({
        width: options.width || 800,
        height: options.height || 800,
        crop: 'limit',
      });
    }

    // Quality and format
    transformations.push({ quality: 'auto' });
    transformations.push({ fetch_format: 'auto' });

    return cloudinary.url(publicId, {
      transformation: transformations,
      secure: true,
    });
  }

  async deletePreview(publicId) {
    return await cloudinary.uploader.destroy(publicId);
  }
}

export const cloudinaryStorage = new CloudinaryStorage();
