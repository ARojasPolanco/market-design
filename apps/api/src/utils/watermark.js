import sharp from 'sharp';

/**
 * Generate a tiled diagonal watermark on an image
 * Each tile contains the Market Design logo (simplified M + bag handle) + text
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
  const fontSize = Math.max(20, Math.min(32, width / 25));
  const iconSize = fontSize * 1.2;
  const spacingX = (iconSize + fontSize * 7);
  const spacingY = fontSize * 6;

  // Simplified "M" logo with bag handle as SVG path
  const logoPath = `
    <g transform="scale(${iconSize / 60})">
      <!-- Bag handle -->
      <path d="M18 8 Q18 0, 26 0 Q34 0, 34 8" 
            fill="none" stroke="white" stroke-width="3.5" stroke-opacity="0.25" 
            stroke-linecap="round"/>
      <!-- M left vertical -->
      <rect x="4" y="10" width="12" height="24" rx="2" 
            fill="white" fill-opacity="0.22"/>
      <!-- M left diagonal -->
      <polygon points="4,10 16,10 10,28" 
               fill="white" fill-opacity="0.22"/>
      <!-- M right diagonal -->
      <polygon points="38,10 50,10 44,28" 
               fill="white" fill-opacity="0.22"/>
      <!-- M right vertical -->
      <rect x="38" y="10" width="12" height="24" rx="2" 
            fill="white" fill-opacity="0.22"/>
      <!-- Cursor -->
      <path d="M42 32 L42 44 L46 40 L50 46 L52 44 L48 38 L52 36 Z" 
            fill="white" fill-opacity="0.20"/>
    </g>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <pattern id="watermark" 
             x="0" y="0" 
             width="${spacingX}" height="${spacingY}" 
             patternUnits="userSpaceOnUse" 
             patternTransform="rotate(${angle} ${width / 2} ${height / 2})">
      
      <!-- Logo icon -->
      ${logoPath}
      
      <!-- Text "Market Design" -->
      <text 
        x="${iconSize + 6}" 
        y="${iconSize * 0.7}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="white" 
        fill-opacity="0.25" 
        dominant-baseline="middle"
      >Market Design</text>
      
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#watermark)" />
</svg>`;
}

export default addWatermark;
