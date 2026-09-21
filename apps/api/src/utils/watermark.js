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

  // Create watermark tile with text using sharp's SVG rendering
  // Using a very simple SVG that should work on Windows
  const tileWidth = 280;
  const tileHeight = 80;
  
  const watermarkSvg = `<svg width="${tileWidth}" height="${tileHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="none"/>
    <text x="50%" y="50%" 
          font-family="sans-serif" 
          font-size="24" 
          font-weight="bold" 
          fill="rgba(255,255,255,0.3)" 
          text-anchor="middle" 
          dominant-baseline="middle"
          transform="rotate(-30, ${tileWidth/2}, ${tileHeight/2})">
      Market Design
    </text>
  </svg>`;

  const watermarkTile = await sharp(Buffer.from(watermarkSvg))
    .resize(tileWidth, tileHeight)
    .png()
    .toBuffer();

  // Tile the watermark across the image
  const composites = [];
  const stepX = tileWidth - 40; // Overlap slightly
  const stepY = tileHeight + 20;
  
  for (let y = -tileHeight; y < targetHeight + tileHeight; y += stepY) {
    for (let x = -tileWidth; x < targetWidth + tileWidth; x += stepX) {
      composites.push({
        input: watermarkTile,
        left: x,
        top: y,
        blend: 'over',
      });
    }
  }

  const watermarked = await sharp(resized)
    .composite(composites)
    .jpeg({ quality: 88 })
    .toBuffer();

  return watermarked;
}

export default generateWatermarkedPreview;
