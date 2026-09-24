import sharp from 'sharp';

export async function generateWatermarkedPreview(fileBuffer) {
  const image = sharp(fileBuffer);
  const metadata = await image.metadata();

  const targetWidth = 1000;
  const targetHeight = Math.round((metadata.height / metadata.width) * targetWidth);

  const resizedBuffer = await image
    .resize(targetWidth, targetHeight)
    .toBuffer();

  const patternWidth = 220;
  const patternHeight = 160;
  const fontSize = 24;
  const fontWeight = 400;
  const opacity = 0.28;
  const rotation = -28;
  const textColor = '#6366F1';

  const watermarkSvg = `
    <svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="watermarkPattern" patternUnits="userSpaceOnUse"
                 width="${patternWidth}" height="${patternHeight}" patternTransform="rotate(${rotation})">
          <g fill="none" stroke="${textColor}" stroke-opacity="${opacity}" stroke-width="2">
            <rect x="0" y="8" width="18" height="16" rx="3" />
            <path d="M 3 8 A 6 6 0 0 1 15 8" />
          </g>
          <text x="24" y="${patternHeight / 2}" font-family="Arial, sans-serif" font-size="${fontSize}"
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
