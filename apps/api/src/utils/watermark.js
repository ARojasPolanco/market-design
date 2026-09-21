import sharp from 'sharp';

/**
 * Generate a watermarked preview from a design file
 * @param {Buffer} fileBuffer - Original file buffer  
 * @returns {Buffer} - Preview image with watermark baked in
 */
export async function generateWatermarkedPreview(fileBuffer) {
  const image = sharp(fileBuffer);
  const metadata = await image.metadata();

  // Resize to 1000px width
  const targetWidth = 1000;
  const targetHeight = Math.round(((metadata.height || 1000) / (metadata.width || 1000)) * targetWidth);

  const resized = await image
    .resize(targetWidth, targetHeight, { fit: 'inside' })
    .jpeg({ quality: 85 })
    .toBuffer();

  // Create watermark SVG with EXACT dimensions of the resized image
  const watermarkSvg = createWatermarkSvg(targetWidth, targetHeight);
  const watermarkBuffer = Buffer.from(watermarkSvg);

  // Composite watermark over image
  const watermarked = await sharp(resized)
    .composite([{ input: watermarkBuffer, top: 0, left: 0, blend: 'over' }])
    .jpeg({ quality: 88 })
    .toBuffer();

  return watermarked;
}

function createWatermarkSvg(width, height) {
  // Pattern tile size
  const tileW = 250;
  const tileH = 80;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="wm" patternUnits="userSpaceOnUse" 
             width="${tileW}" height="${tileH}" 
             patternTransform="rotate(-30 ${width/2} ${height/2})">
      <text x="${tileW/2}" y="${tileH/2}" 
            font-family="Arial, Helvetica, sans-serif" 
            font-size="24" 
            font-weight="bold" 
            fill="black" 
            fill-opacity="0.25"
            text-anchor="middle" 
            dominant-baseline="middle">
        Market Design
      </text>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wm)"/>
</svg>`;
}

export default generateWatermarkedPreview;
