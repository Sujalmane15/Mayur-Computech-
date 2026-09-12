import fs from 'fs';
import sharp from 'sharp';

// Build the SVG composite
const WIDTH = 1200;
const HEIGHT = 540;

const svgBanner = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="100%" height="100%">
  <defs>
    <!-- Tech Green Gradient -->
    <linearGradient id="greenBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a7a39" />
      <stop offset="50%" stop-color="#0d8a3e" />
      <stop offset="100%" stop-color="#07662c" />
    </linearGradient>

    <!-- Circuit lines pattern -->
    <pattern id="circuitPattern" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M 10 10 L 40 10 L 60 30 L 100 30 M 30 50 L 30 80 L 50 100 L 90 100 M 70 20 L 70 60 L 90 80 M 110 40 L 110 90" 
            fill="none" stroke="#22a857" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />
      <circle cx="10" cy="10" r="3.5" fill="#22a857" opacity="0.5" />
      <circle cx="100" cy="30" r="3.5" fill="#22a857" opacity="0.5" />
      <circle cx="90" cy="100" r="3.5" fill="#22a857" opacity="0.5" />
      <circle cx="110" cy="90" r="3.5" fill="#22a857" opacity="0.5" />
    </pattern>

    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.35" />
    </filter>

    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity="0.2" />
    </filter>

    <clipPath id="bannerClip">
      <rect width="${WIDTH}" height="${HEIGHT}" rx="18" ry="18" />
    </clipPath>

    <clipPath id="girlClip">
      <rect x="0" y="0" width="460" height="${HEIGHT}" />
    </clipPath>
  </defs>

  <!-- Base Card Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#greenBg)" rx="18" ry="18" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#circuitPattern)" rx="18" ry="18" />

  <!-- Left Side: Student Photo -->
  <g clip-path="url(#girlClip)">
    <image href="/msoffice-banner.jpg" x="-40" y="-30" width="600" height="600" preserveAspectRatio="xMidYMid slice" />
  </g>

  <!-- Right Section: Marathi Headline & Details -->
  <g transform="translate(430, 0)">
    <!-- Marathi Main Heading -->
    <text x="360" y="85" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Mukta', 'Mangal', sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" filter="url(#dropShadow)" letter-spacing="0.5">
      MS-OFFICE 2021 मुळे मी
    </text>
    <text x="360" y="145" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Mukta', 'Mangal', sans-serif" font-weight="900" font-size="42" fill="#FFFFFF" filter="url(#dropShadow)" letter-spacing="0.5">
      स्वतःच्या प्रगतीचे पाऊल उचलू शकलो
    </text>

    <!-- Center White Badge for MS-OFFICE 2021 -->
    <g transform="translate(145, 175)" filter="url(#dropShadow)">
      <!-- Main Badge Box -->
      <rect width="430" height="150" rx="8" fill="#FFFFFF" stroke="#c0392b" stroke-width="2" />
      
      <!-- MS-OFFICE 2021 Header inside badge -->
      <text x="215" y="44" text-anchor="middle" font-family="'Arial Black', 'Montserrat', sans-serif" font-weight="900" font-size="34" fill="#111827">
        MS-OFFICE 2021
      </text>

      <!-- App Icons: Word, Excel, PowerPoint, Outlook -->
      <g transform="translate(42, 60)">
        <!-- Word -->
        <rect x="0" y="0" width="70" height="42" rx="5" fill="#185ABD" />
        <text x="35" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" fill="#FFFFFF">W</text>

        <!-- Excel -->
        <rect x="90" y="0" width="70" height="42" rx="5" fill="#107C41" />
        <text x="125" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" fill="#FFFFFF">X</text>

        <!-- PowerPoint -->
        <rect x="180" y="0" width="70" height="42" rx="5" fill="#C43E1C" />
        <text x="215" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" fill="#FFFFFF">P</text>

        <!-- Outlook -->
        <rect x="270" y="0" width="70" height="42" rx="5" fill="#0078D4" />
        <text x="305" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="26" fill="#FFFFFF">O</text>
      </g>

      <!-- Black bottom stripe inside badge -->
      <rect x="0" y="112" width="430" height="38" rx="0" fill="#000000" />
      <text x="215" y="137" text-anchor="middle" font-family="'Noto Sans Devanagari', 'Mukta', sans-serif" font-weight="700" font-size="16" fill="#FFFFFF">
        संपूर्ण कार्यक्षमतेसाठी प्रगत टूल्सचा वापर
      </text>
    </g>

    <!-- Search / MKCL Pill -->
    <g transform="translate(195, 345)" filter="url(#softShadow)">
      <rect width="330" height="38" rx="19" fill="#FFFFFF" />
      <circle cx="24" cy="19" r="6" fill="none" stroke="#64748b" stroke-width="2.2" />
      <line x1="28" y1="23" x2="35" y2="30" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" />
      <text x="165" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="15" fill="#1e293b">
        msoffice2021.mkcl.org
      </text>
      <!-- Mic icon -->
      <rect x="295" y="11" width="7" height="11" rx="3.5" fill="#3b82f6" />
      <path d="M 292 18 Q 292 24 298.5 24 Q 305 24 305 18" fill="none" stroke="#ef4444" stroke-width="1.8" />
      <line x1="298.5" y1="24" x2="298.5" y2="28" stroke="#ef4444" stroke-width="1.8" />
    </g>

    <!-- Institute & Contact Info -->
    <text x="360" y="445" text-anchor="middle" font-family="'Montserrat', 'Arial Black', sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" filter="url(#dropShadow)">
      Class: MAYUR COMPUTECH
    </text>
    <text x="360" y="495" text-anchor="middle" font-family="'Montserrat', 'Arial Black', sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" filter="url(#dropShadow)">
      Mobile: 8655050595
    </text>
  </g>
</svg>
`;

fs.writeFileSync('public/mscit-official-banner.svg', svgBanner.trim());
console.log('Successfully saved public/mscit-official-banner.svg');

// Also render into ultra-sharp PNG
await sharp(Buffer.from(svgBanner.trim()))
  .resize(1200, 540)
  .png({ quality: 100 })
  .toFile('public/mscit-official-banner.png');

console.log('Successfully generated public/mscit-official-banner.png');
