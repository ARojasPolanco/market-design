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

  // Icon positioned inline with text, centered vertically
  // Icon is 80% of text height, aligned at middle
  const watermarkSvg = `
    <svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="watermarkPattern" patternUnits="userSpaceOnUse"
                 width="${patternWidth}" height="${patternHeight}" patternTransform="rotate(${rotation})">
          <g transform="translate(0, ${patternHeight / 2 - 10})">
            <g fill="none" stroke="${textColor}" stroke-opacity="${opacity}" stroke-width="2">
              <rect x="0" y="0" width="16" height="14" rx="2" />
              <path d="M 2 0 A 5 5 0 0 1 14 0" />
            </g>
            <text x="22" y="12" font-family="Arial, sans-serif" font-size="${fontSize}"
                  font-weight="${fontWeight}" fill="${textColor}" fill-opacity="${opacity}"
                  dominant-baseline="middle">
              Market Design
            </text>
          </g>
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
