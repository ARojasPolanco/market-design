import { v2 as cloudinary } from 'cloudinary';
import { envs } from '../enviroments.js';
import { generateWatermarkedPreview } from '../../utils/watermark.js';

cloudinary.config({
  cloud_name: envs.CLOUDINARY_CLOUD_NAME,
  api_key: envs.CLOUDINARY_API_KEY,
  api_secret: envs.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorage {
  /**
   * Upload preview with watermark baked in
   * Returns: { publicId, url }
   */
  async uploadPreview(fileBuffer, fileName) {
    const baseName = `preview-${Date.now()}-${fileName.split('.')[0]}`;
    
    // Generate watermarked preview (resized + watermark baked in)
    const watermarkedBuffer = await generateWatermarkedPreview(fileBuffer);
    
    // Upload to Cloudinary
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
