import sharp from 'sharp';

/**
 * Generate a watermarked preview from a design file
 * Based on user's calibrated values - do NOT modify without seeing the result first
 */
export async function generateWatermarkedPreview(fileBuffer) {
  const image = sharp(fileBuffer);
  const metadata = await image.metadata();

  const targetWidth = 1000;
  const targetHeight = Math.round((metadata.height / metadata.width) * targetWidth);

  const resizedBuffer = await image
    .resize(targetWidth, targetHeight)
    .toBuffer();

  // VALORES FIJOS - no cambiar sin ver el resultado primero
  const patternWidth = 300;
  const patternHeight = 220;
  const fontSize = 26;
  const fontWeight = 400;
  const opacity = 0.15;
  const rotation = -30;
  const textColor = '#4a4a4a';

  const watermarkSvg = `
    <svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="watermarkPattern" patternUnits="userSpaceOnUse"
                 width="${patternWidth}" height="${patternHeight}" patternTransform="rotate(${rotation})">
          <text x="15" y="${patternHeight / 2}" font-family="Arial, sans-serif" font-size="${fontSize}"
                font-weight="${fontWeight}" fill="${textColor}" fill-opacity="${opacity}">
            Market Design
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#watermarkPattern)" />
    </svg>
  `;

  const watermarkBuffer = Buffer.from(watermarkSvg);

  const result = await sharp(resizedBuffer)
    .composite([{ input: watermarkBuffer, top: 0, left: 0 }])
    .jpeg({ quality: 88 })
    .toBuffer();

  return result;
}

export default generateWatermarkedPreview;
