import fs from 'fs';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 675; // 16:9

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f7fd" />
      <stop offset="50%" stop-color="#e3effb" />
      <stop offset="100%" stop-color="#d6e8f8" />
    </linearGradient>

    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
      <stop offset="60%" stop-color="#dcecf9" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#c9e0f5" stop-opacity="0" />
    </radialGradient>

    <!-- Subtle Tech Grid -->
    <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="1.2" fill="#93bce0" opacity="0.4" />
    </pattern>

    <filter id="navyShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#001845" flood-opacity="0.18" />
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#001845" flood-opacity="0.22" />
    </filter>

    <filter id="codeBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="0.4" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dotGrid)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#centerGlow)" />

  <!-- Tilted Monospace C Code in Background -->
  <g transform="translate(600, 337) rotate(-18) translate(-600, -337)" filter="url(#codeBlur)" opacity="0.48">
    <g font-family="'Consolas', 'Courier New', 'Fira Code', monospace" font-size="34" font-weight="600" fill="#4b6b8b">
      <text x="320" y="160">#include &lt;stdio.h&gt;</text>
      <text x="320" y="225">int main(void)</text>
      <text x="320" y="285">{</text>
      <text x="370" y="345">printf("Hello, World!\\n");</text>
      <text x="370" y="405">return 0;</text>
      <text x="320" y="465">}</text>
    </g>
  </g>

  <!-- Central Bold Navy C / C++ Typography -->
  <g filter="url(#navyShadow)">
    <text x="600" y="375" text-anchor="middle" 
          font-family="'Arial Black', 'Inter', 'Montserrat', system-ui, sans-serif" 
          font-weight="900" 
          font-size="140" 
          fill="#001a4e" 
          letter-spacing="2">
      C / C++
    </text>
  </g>

  <!-- Subtle bottom pill tag -->
  <g transform="translate(600, 480)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="rgba(255, 255, 255, 0.9)" stroke="#93bce0" stroke-width="1.5" />
    <text x="0" y="6" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="15" fill="#0c4a6e" letter-spacing="1">
      LOGIC &amp; OOP MASTERY
    </text>
  </g>
</svg>
`;

fs.writeFileSync('public/c-cpp-banner.svg', svgContent.trim());
console.log('Saved c-cpp-banner.svg');

await sharp(Buffer.from(svgContent.trim()))
  .resize(WIDTH, HEIGHT)
  .png({ quality: 100 })
  .toFile('public/c-cpp-banner.png');

console.log('Generated c-cpp-banner.png successfully');
