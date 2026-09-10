import sharp from 'sharp';
import { AppError } from '../../errors/appError.js';

const MIN_DPI = 150;
const MIN_FILE_SIZE = 1024; // 1KB
const PREVIEW_WIDTH = 1000;
const PREVIEW_QUALITY = 85;

export class ImageProcessor {
  async validateFile(fileBuffer, mimeType) {
    // Check minimum file size
    if (fileBuffer.length < MIN_FILE_SIZE) {
      throw new AppError('El archivo parece estar vacío o corrupto.', 400);
    }

    // Check if it's an image for DPI validation
    if (mimeType.startsWith('image/')) {
      try {
        const metadata = await sharp(fileBuffer).metadata();
        
        // Check DPI
        if (metadata.density && metadata.density < MIN_DPI) {
          throw new AppError(
            `La resolución es de ${metadata.density} DPI. El mínimo aceptado es ${MIN_DPI} DPI.`,
            400
          );
        }

        // Check minimum dimensions
        if (metadata.width < 800 || metadata.height < 800) {
          throw new AppError(
            'Las dimensiones mínimas son 800x800 píxeles.',
            400
          );
        }

        return {
          valid: true,
          metadata: {
            width: metadata.width,
            height: metadata.height,
            dpi: metadata.density || null,
            format: metadata.format,
          },
        };
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('No se pudo leer la imagen. Verificá que el archivo no esté corrupto.', 400);
      }
    }

    return { valid: true, metadata: null };
  }

  async generatePreview(imageBuffer) {
    try {
      // Resize to preview width maintaining aspect ratio
      const resized = await sharp(imageBuffer)
        .resize(PREVIEW_WIDTH, null, { withoutEnlargement: true })
        .jpeg({ quality: PREVIEW_QUALITY })
        .toBuffer();

      // Create watermark
      const watermarkText = 'MARKET DESIGN';
      const watermarkSvg = `
        <svg width="400" height="60">
          <style>
            text {
              font-family: 'Montserrat', Arial, sans-serif;
              font-size: 24px;
              font-weight: bold;
              fill: white;
              opacity: 0.25;
            }
          </style>
          <text x="10" y="40">${watermarkText}</text>
        </svg>
      `;

      const watermarkBuffer = Buffer.from(watermarkSvg);

      // Get image dimensions
      const metadata = await sharp(resized).metadata();

      // Create tiled watermark
      const watermark = await sharp(watermarkBuffer)
        .resize(Math.floor(metadata.width * 0.4))
        .toBuffer();

      // Apply watermark in diagonal pattern
      const preview = await sharp(resized)
        .composite([
          {
            input: watermark,
            top: Math.floor(metadata.height * 0.3),
            left: Math.floor(metadata.width * 0.1),
            blend: 'over',
          },
          {
            input: watermark,
            top: Math.floor(metadata.height * 0.6),
            left: Math.floor(metadata.width * 0.4),
            blend: 'over',
          },
        ])
        .jpeg({ quality: 80 })
        .toBuffer();

      return preview;
    } catch (_error) {
      throw new AppError('Error al generar la preview del diseño.', 500);
    }
  }

  async getMetadata(buffer) {
    return await sharp(buffer).metadata();
  }
}

export const imageProcessor = new ImageProcessor();
