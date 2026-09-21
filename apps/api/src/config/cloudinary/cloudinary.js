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
   * Returns: { publicId, url (watermarked), cleanUrl }
   */
  async uploadPreview(fileBuffer, fileName) {
    const baseName = `preview-${Date.now()}-${fileName.split('.')[0]}`;
    
    // Upload clean version first
    const cleanResult = await this._uploadToCloudinary(fileBuffer, `${baseName}-clean`, 'market-design/previews/clean');
    
    // Generate watermarked version
    const watermarkedBuffer = await addWatermark(fileBuffer);
    
    // Upload watermarked version
    const watermarkedResult = await this._uploadToCloudinary(watermarkedBuffer, `${baseName}-wm`, 'market-design/previews/wm');

    return {
      publicId: watermarkedResult.public_id,      // For public display (with watermark)
      cleanPublicId: cleanResult.public_id,        // For buyers (without watermark)
      url: watermarkedResult.secure_url,           // Watermarked URL
      cleanUrl: cleanResult.secure_url,            // Clean URL
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

  /**
   * Get clean preview URL for buyers
   */
  getCleanUrl(cleanPublicId) {
    if (!cleanPublicId) return null;
    return cloudinary.url(cleanPublicId, {
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
      secure: true,
    });
  }

  async deletePreview(publicId) {
    return await cloudinary.uploader.destroy(publicId);
  }
}

export const cloudinaryStorage = new CloudinaryStorage();
