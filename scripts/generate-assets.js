/**
 * Generates required app assets (icon, splash, adaptive-icon, notification-icon)
 * as simple colored PNGs with text, using only Node.js built-ins.
 *
 * Run: node scripts/generate-assets.js
 */

const fs = require('fs');
const path = require('path');

// Minimal PNG encoder for solid-color images with optional centered text
function createPNG(width, height, r, g, b) {
  // We'll create a very simple uncompressed PNG
  // For store submission you should replace these with real designed assets

  const { createCanvas } = (() => {
    try {
      return require('canvas');
    } catch {
      return { createCanvas: null };
    }
  })();

  if (createCanvas) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, width, height);
    return canvas.toBuffer('image/png');
  }

  // Fallback: create a 1x1 PNG (placeholder)
  // This is a valid minimal PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = crc ^ buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeData = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeData));
    return Buffer.concat([len, typeData, crc]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT - raw pixel data (uncompressed deflate)
  const rowSize = 1 + width * 3; // filter byte + RGB per pixel
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0; // filter none
    for (let x = 0; x < width; x++) {
      const offset = y * rowSize + 1 + x * 3;
      rawData[offset] = r;
      rawData[offset + 1] = g;
      rawData[offset + 2] = b;
    }
  }

  // Compress with zlib
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawData);

  // IEND
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    iend,
  ]);
}

const assetsDir = path.join(__dirname, '..', 'assets');

// App icon (1024x1024) - purple (#7C3AED)
const icon = createPNG(1024, 1024, 124, 58, 237);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), icon);

// Adaptive icon foreground (1024x1024) - purple
const adaptive = createPNG(1024, 1024, 124, 58, 237);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptive);

// Splash screen (1284x2778) - purple
const splash = createPNG(1284, 2778, 124, 58, 237);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splash);

// Notification icon (96x96) - white on transparent (just white for now)
const notif = createPNG(96, 96, 255, 255, 255);
fs.writeFileSync(path.join(assetsDir, 'notification-icon.png'), notif);

// Favicon for web (48x48) - purple
const favicon = createPNG(48, 48, 124, 58, 237);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), favicon);

// Widget preview placeholders
const widgetSmall = createPNG(220, 220, 124, 58, 237);
fs.writeFileSync(path.join(assetsDir, 'widget-preview-small.png'), widgetSmall);

const widgetMedium = createPNG(440, 220, 124, 58, 237);
fs.writeFileSync(path.join(assetsDir, 'widget-preview-medium.png'), widgetMedium);

console.log('Assets generated in ./assets/');
console.log('  icon.png (1024x1024)');
console.log('  adaptive-icon.png (1024x1024)');
console.log('  splash.png (1284x2778)');
console.log('  notification-icon.png (96x96)');
console.log('  favicon.png (48x48)');
console.log('  widget-preview-small.png (220x220)');
console.log('  widget-preview-medium.png (440x220)');
console.log('');
console.log('IMPORTANT: Replace these with professionally designed assets before store submission!');
