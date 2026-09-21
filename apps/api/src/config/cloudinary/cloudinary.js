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

    // Resize
    transformations.push({
      width: options.width || 800,
      height: options.height || 800,
      crop: 'limit',
    });

    // Add watermark for public display (not for downloads)
    if (options.watermark !== false) {
      transformations.push({
        overlay: {
          font_family: 'Arial',
          font_size: 40,
          font_weight: 'bold',
          text: 'MARKET DESIGN',
        },
        color: '#FFFFFF80',
        gravity: 'center',
        opacity: 40,
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

  getCleanPreviewUrl(publicId, options = {}) {
    return this.getPreviewUrl(publicId, { ...options, watermark: false });
  }

  addWatermarkToUrl(url) {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    // Parse the Cloudinary URL to extract the public_id
    // Format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{public_id}.{ext}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return url;
    
    const publicId = match[1];
    // Generate new URL with watermark transformation
    return cloudinary.url(publicId, {
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        {
          overlay: {
            font_family: 'Arial',
            font_size: 40,
            font_weight: 'bold',
            text: 'MARKET DESIGN',
          },
          color: '#FFFFFF80',
          gravity: 'center',
          opacity: 40,
        },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
      secure: true,
    });
  }

  removeWatermarkFromUrl(url) {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    // Parse the Cloudinary URL to extract the public_id
    const match = url.match(/\/upload\/(?:[^/]+\/)*v\d+\/(.+)$/) || url.match(/\/upload\/(.+)$/);
    if (!match) return url;
    
    const publicId = match[1];
    // Generate new URL without watermark
    return cloudinary.url(publicId, {
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
