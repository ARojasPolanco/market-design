import { v2 as cloudinary } from 'cloudinary';
import { envs } from '../enviroments.js';
import { addWatermark } from '../../utils/watermark.js';

cloudinary.config({
  cloud_name: envs.CLOUDINARY_CLOUD_NAME,
  api_key: envs.CLOUDINARY_API_KEY,
  api_secret: envs.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorage {
  /**
   * Upload preview with watermark
   * Returns: { publicId, url }
   */
  async uploadPreview(fileBuffer, fileName) {
    const baseName = `preview-${Date.now()}-${fileName.split('.')[0]}`;
    
    // Generate watermarked version
    const watermarkedBuffer = await addWatermark(fileBuffer);
    
    // Upload watermarked version
    const result = await this._uploadToCloudinary(watermarkedBuffer, baseName, 'market-design/previews');

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  }

  async _uploadToCloudinary(buffer, publicId, folder) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
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
      stream.end(buffer);
    });
  }

  async deletePreview(publicId) {
    return await cloudinary.uploader.destroy(publicId);
  }
}

export const cloudinaryStorage = new CloudinaryStorage();
