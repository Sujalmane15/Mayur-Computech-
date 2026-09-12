import fs from 'fs';
import opentype from 'opentype.js';
import sharp from 'sharp';

// Load Montserrat 900 (Black)
const fontBuffer = fs.readFileSync('node_modules/@fontsource/montserrat/files/montserrat-latin-900-normal.woff');
const font = opentype.parse(fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength));

// Exact Brand Colors from the reference:
const COLOR_RED = '#E30613';   // Vivid Primary Red
const COLOR_BLUE = '#005CB9';  // Vibrant Royal Blue
const COLOR_WHITE = '#FFFFFF';

// High-resolution Master Canvas
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 800;

// 1. "MAYUR" Typography
const mayurFontSize = 260;
const mayurText = 'MAYUR';
const mayurGlyphs = font.stringToGlyphs(mayurText);

let mayurWidth = 0;
for (let i = 0; i < mayurGlyphs.length; i++) {
  const glyph = mayurGlyphs[i];
  mayurWidth += (glyph.advanceWidth || 0) * (mayurFontSize / font.unitsPerEm);
  if (i < mayurGlyphs.length - 1) {
    mayurWidth += font.getKerningValue(glyph, mayurGlyphs[i + 1]) * (mayurFontSize / font.unitsPerEm);
  }
}

// Center MAYUR horizontally
const mayurX = (CANVAS_WIDTH - mayurWidth) / 2;
const mayurY = 360; // baseline

const mayurPath = font.getPath(mayurText, mayurX, mayurY, mayurFontSize);
const mayurSvgPath = mayurPath.toPathData(2);

// 2. Pill / Capsule Dimensions
// In the original logo, the pill width aligns almost identically with MAYUR width
const pillX = mayurX - 10;
const pillWidth = mayurWidth + 20;
const pillY = 425;
const pillHeight = 220;
const pillRadius = 55; // Smooth modern capsule curvature
const pillStrokeWidth = 16;

// 3. Texts inside Pill: "Compu" and "Tech"
const compuTechFontSize = 145;

// Compu
const compuText = 'Compu';
const compuGlyphs = font.stringToGlyphs(compuText);
let compuWidth = 0;
for (let i = 0; i < compuGlyphs.length; i++) {
  const glyph = compuGlyphs[i];
  compuWidth += (glyph.advanceWidth || 0) * (compuTechFontSize / font.unitsPerEm);
  if (i < compuGlyphs.length - 1) {
    compuWidth += font.getKerningValue(glyph, compuGlyphs[i + 1]) * (compuTechFontSize / font.unitsPerEm);
  }
}

// Tech
const techText = 'Tech';
const techGlyphs = font.stringToGlyphs(techText);
let techWidth = 0;
for (let i = 0; i < techGlyphs.length; i++) {
  const glyph = techGlyphs[i];
  techWidth += (glyph.advanceWidth || 0) * (compuTechFontSize / font.unitsPerEm);
  if (i < techGlyphs.length - 1) {
    techWidth += font.getKerningValue(glyph, techGlyphs[i + 1]) * (compuTechFontSize / font.unitsPerEm);
  }
}

// Baseline alignment for texts inside capsule:
// Ascender/descender balanced inside pillHeight (220)
const compuBaselineY = pillY + 155;

// Compu X position with generous left padding inside the blue rounded cap
const compuX = pillX + 68;
const compuPath = font.getPath(compuText, compuX, compuBaselineY, compuTechFontSize);
const compuSvgPath = compuPath.toPathData(2);

// The blue background extends from pillX up to a vertical split line after "Compu"
const splitPaddingRight = 45;
const splitX = compuX + compuWidth + splitPaddingRight;

// Tech position: nicely centered/balanced inside the white section
const rightSectionWidth = (pillX + pillWidth) - splitX;
const techX = splitX + (rightSectionWidth - techWidth) / 2;

const techPath = font.getPath(techText, techX, compuBaselineY, compuTechFontSize);
const techSvgPath = techPath.toPathData(2);

// Build complete, clean, standalone SVG with exact mathematical paths
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" width="100%" height="100%">
  <!-- Clean Pure White Background -->
  <rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="${COLOR_WHITE}" />

  <defs>
    <!-- Clip path to keep fills cleanly inside the rounded pill capsule -->
    <clipPath id="capsuleClip">
      <rect x="${pillX}" y="${pillY}" width="${pillWidth}" height="${pillHeight}" rx="${pillRadius}" ry="${pillRadius}" />
    </clipPath>
  </defs>

  <!-- 1. Top Word: MAYUR (Vivid Red Exact Vector Outlines) -->
  <path d="${mayurSvgPath}" fill="${COLOR_RED}" />

  <!-- 2. Bottom Capsule Structure -->
  <g clip-path="url(#capsuleClip)">
    <!-- Right side background (Pure White) -->
    <rect x="${pillX}" y="${pillY}" width="${pillWidth}" height="${pillHeight}" fill="${COLOR_WHITE}" />
    
    <!-- Left side solid Blue background block -->
    <rect x="${pillX}" y="${pillY}" width="${splitX - pillX}" height="${pillHeight}" fill="${COLOR_BLUE}" />
  </g>

  <!-- Capsule Outer Blue Border (Seamless connection with the left fill) -->
  <rect x="${pillX}" y="${pillY}" width="${pillWidth}" height="${pillHeight}" rx="${pillRadius}" ry="${pillRadius}" fill="none" stroke="${COLOR_BLUE}" stroke-width="${pillStrokeWidth}" stroke-linejoin="round" />

  <!-- 3. Text: 'Compu' (Crisp Pure White Vector Path on Blue Fill) -->
  <path d="${compuSvgPath}" fill="${COLOR_WHITE}" />

  <!-- 4. Text: 'Tech' (Vivid Royal Blue Vector Path on White Background) -->
  <path d="${techSvgPath}" fill="${COLOR_BLUE}" />
</svg>`;

// Save master SVG
fs.writeFileSync('public/mayur-computech-logo.svg', svgContent);
console.log('Successfully saved public/mayur-computech-logo.svg');

// Generate High-Res 3200x1600 PNG (Crisp 4K Vector Export for Print & Web)
await sharp(Buffer.from(svgContent))
  .resize(3200, 1600, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png({ quality: 100, compressionLevel: 9 })
  .toFile('public/mayur-computech-logo.png');

console.log('Successfully generated public/mayur-computech-logo.png (3200x1600 Ultra-HD)');

// Generate Standard Web PNG (800x400)
await sharp(Buffer.from(svgContent))
  .resize(800, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png({ quality: 100 })
  .toFile('public/mayur-computech-logo-web.png');

console.log('Successfully generated public/mayur-computech-logo-web.png');
