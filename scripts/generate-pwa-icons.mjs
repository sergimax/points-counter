/**
 * Generate PWA install icons (192 / 512 PNG) from public/logo.svg.
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = path.join(root, "public", "logo.svg");
const outDir = path.join(root, "public");

const sizes = [192, 512];

const logoSvg = await readFile(logoPath);

await mkdir(outDir, { recursive: true });

for (const size of sizes) {
  // Maskable-safe padding (~20% total) on brand paper background.
  const pad = Math.round(size * 0.12);
  const inner = size - pad * 2;
  const icon = await sharp(logoSvg).resize(inner, inner).png().toBuffer();

  const png = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 252, g: 251, b: 249, alpha: 1 },
    },
  })
    .composite([{ input: icon, left: pad, top: pad }])
    .png()
    .toFile(path.join(outDir, `pwa-${size}.png`));

  console.log(`wrote public/pwa-${size}.png (${png.width}x${png.height})`);
}

// Apple touch icon (180×180).
{
  const size = 180;
  await sharp(logoSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, "apple-touch-icon.png"));
  console.log("wrote public/apple-touch-icon.png");
}
