import sharp from 'sharp';

/**
 * Generate a tiled diagonal watermark on an image
 * @param {Buffer} imageBuffer - Original image buffer
 * @returns {Buffer} - Image with watermark
 */
export async function addWatermark(imageBuffer) {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Create SVG watermark pattern
  const watermarkSvg = createWatermarkSvg(width, height);

  // Composite watermark over image
  const watermarked = await image
    .composite([{
      input: Buffer.from(watermarkSvg),
      top: 0,
      left: 0,
    }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return watermarked;
}

function createWatermarkSvg(width, height) {
  const angle = 27; // degrees
  const fontSize = Math.max(28, Math.min(48, width / 15));
  const spacing = fontSize * 6; // Space between watermarks (smaller = more dense)
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <pattern id="watermark" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
      <text 
        x="${spacing / 2}" 
        y="${spacing / 2}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="white" 
        fill-opacity="0.30" 
        text-anchor="middle"
        dominant-baseline="middle"
        stroke="rgba(0,0,0,0.15)"
        stroke-width="1"
      >Market Design</text>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#watermark)" />
</svg>`;
}

export default addWatermark;
