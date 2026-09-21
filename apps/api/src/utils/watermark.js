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

  // Create watermark overlay as PNG
  const overlay = await createWatermarkOverlay(width, height);

  // Composite watermark over image
  const watermarked = await image
    .composite([{
      input: overlay,
      top: 0,
      left: 0,
    }])
    .jpeg({ quality: 92 })
    .toBuffer();

  return watermarked;
}

async function createWatermarkOverlay(width, height) {
  // Create a single watermark tile
  const tileWidth = 350;
  const tileHeight = 60;
  const angle = 27;

  // Create single tile SVG
  const tileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth}" height="${tileHeight}">
    <text x="${tileWidth / 2}" y="${tileHeight / 2}" 
      font-family="Arial, sans-serif" 
      font-size="28" 
      font-weight="bold" 
      fill="white" 
      fill-opacity="0.28"
      text-anchor="middle"
      dominant-baseline="middle">Market Design</text>
  </svg>`;

  const tileBuffer = Buffer.from(tileSvg);

  // Create the full overlay
  const diagonal = Math.ceil(Math.sqrt(width * width + height * height));
  const cols = Math.ceil(diagonal / tileWidth) + 2;
  const rows = Math.ceil(diagonal / tileHeight) + 2;

  // Create large canvas with tiles
  const overlayWidth = cols * tileWidth;
  const overlayHeight = rows * tileHeight;

  // Build composite operations for all tiles
  const composites = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      composites.push({
        input: tileBuffer,
        left: col * tileWidth,
        top: row * tileHeight,
      });
    }
  }

  // Create the tiled overlay
  const tiledOverlay = await sharp({
    create: {
      width: overlayWidth,
      height: overlayHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  // Rotate the overlay
  const rotatedOverlay = await sharp(tiledOverlay)
    .rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(width, height, { fit: 'cover' })
    .png()
    .toBuffer();

  return rotatedOverlay;
}

export default addWatermark;
