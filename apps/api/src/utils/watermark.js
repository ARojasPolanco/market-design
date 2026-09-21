import sharp from 'sharp';

/**
 * Generate a watermarked preview from a design file
 * The watermark is baked into the image pixels using sharp composite
 * @param {Buffer} fileBuffer - Original file buffer
 * @returns {Buffer} - Preview image with watermark baked in
 */
export async function generateWatermarkedPreview(fileBuffer) {
  // 1. Get image metadata
  const image = sharp(fileBuffer);
  const metadata = await image.metadata();

  // 2. Resize to preview width (1000px), maintain aspect ratio
  const targetWidth = 1000;
  const targetHeight = Math.round(((metadata.height || 1000) / (metadata.width || 1000)) * targetWidth);

  const resizedBuffer = await image
    .resize(targetWidth, targetHeight, { fit: 'inside' })
    .jpeg({ quality: 90 })
    .toBuffer();

  // 3. Generate watermark SVG with same dimensions as the resized image
  const watermarkSvg = createWatermarkSvg(targetWidth, targetHeight);
  const watermarkBuffer = Buffer.from(watermarkSvg);

  // 4. Composite watermark over image
  const watermarkedBuffer = await sharp(resizedBuffer)
    .composite([{ input: watermarkBuffer, top: 0, left: 0, blend: 'over' }])
    .jpeg({ quality: 92 })
    .toBuffer();

  return watermarkedBuffer;
}

function createWatermarkSvg(width, height) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="watermarkPattern" patternUnits="userSpaceOnUse"
               width="220" height="140" patternTransform="rotate(-30)">
        <text x="10" y="80" font-family="Arial, sans-serif" font-size="22"
              font-weight="bold" fill="white" fill-opacity="0.25">
          Market Design
        </text>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#watermarkPattern)" />
  </svg>`;
}

export default generateWatermarkedPreview;
