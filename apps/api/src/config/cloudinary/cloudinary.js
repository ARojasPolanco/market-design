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
          text: 'MARKET%20DESIGN',
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
    // Insert watermark transformation into Cloudinary URL
    return url.replace('/upload/', '/upload/l_text:Arial_40_bold:MARKET%20DESIGN,co_white,op_40,g_center/');
  }

  removeWatermarkFromUrl(url) {
    if (!url || !url.includes('cloudinary.com')) return url;
    // Remove watermark transformation from Cloudinary URL
    return url.replace('/l_text:Arial_40_bold:MARKET%20DESIGN,co_white,op_40,g_center/', '/upload/');
  }

  async deletePreview(publicId) {
    return await cloudinary.uploader.destroy(publicId);
  }
}

export const cloudinaryStorage = new CloudinaryStorage();
