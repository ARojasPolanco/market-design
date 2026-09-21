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
  // Calculate diagonal length to ensure full coverage
  const diagonal = Math.sqrt(width * width + height * height);
  
  // Create repeating "Market Design" text at 25-30 degree angle
  const angle = 27; // degrees
  const fontSize = Math.max(24, Math.min(40, width / 20));
  const spacing = fontSize * 8; // Space between watermarks
  
  // Generate multiple watermark positions
  const watermarks = [];
  const rows = Math.ceil(diagonal / spacing) + 2;
  const cols = Math.ceil(diagonal / spacing) + 2;
  
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * spacing;
      const y = row * spacing;
      watermarks.push(`
        <text 
          x="${x}" 
          y="${y}" 
          font-family="Arial, sans-serif" 
          font-size="${fontSize}" 
          font-weight="bold" 
          fill="white" 
          fill-opacity="0.18" 
          transform="rotate(${angle}, ${x}, ${y})"
          text-anchor="middle"
          dominant-baseline="middle"
        >Market Design</text>
      `);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="watermark" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
      <text 
        x="${spacing / 2}" 
        y="${spacing / 2}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="white" 
        fill-opacity="0.18" 
        text-anchor="middle"
        dominant-baseline="middle"
      >Market Design</text>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#watermark)" />
</svg>`;
}

export default addWatermark;
