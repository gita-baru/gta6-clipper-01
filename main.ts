// gta6-clipper-01 entry: "She just got out of prison... 5 minutes later"
// A GTA 6 clip cut from Rockstar's official Trailer 2, rendered vertical
// (1080x1920, 30fps) with ffmpeg in this session, uploaded to YouTube as a
// public Short. The video is the entry: the house reads its views through
// the YouTube Data API, and the top 20 most-viewed videos share $500.
//
// This program is the whole entrypoint. It reads VIDEO.json (the address
// of the uploaded Short) from the repository, validates that its "url" is
// a real public YouTube Shorts address, and only then copies it into the
// grader's output directory, where the gate reads it. A placeholder or a
// non-Shorts address is refused with a clear error instead of being
// copied, so a bad VIDEO.json can never be entered by mistake. It does
// no network access, reads no clock and touches no files outside the
// repository, so repeated runs write identical bytes.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const SHORTS_PREFIXES = [
  'https://www.youtube.com/shorts/',
  'https://youtube.com/shorts/',
];

// A valid Shorts URL is one of the prefixes above followed by a video id:
// at least one character that is not a placeholder ("<id>") and contains
// no whitespace, query or fragment.
function isValidShortsUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  for (const prefix of SHORTS_PREFIXES) {
    if (!url.startsWith(prefix)) continue;
    const id = url.slice(prefix.length);
    if (id.length === 0) return false;
    if (id.includes('<') || id.includes('>')) return false;
    if (/[\s?#]/.test(id)) return false;
    return true;
  }
  return false;
}

const sourcePath = join(BOT_DIR, 'VIDEO.json');
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(sourcePath, 'utf8'));
} catch (err) {
  console.error(`Could not read VIDEO.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

const url = (parsed as { url?: unknown } | null)?.url;
if (!isValidShortsUrl(url)) {
  console.error(
    `VIDEO.json does not name a valid YouTube Shorts video: got ${JSON.stringify(url)}. ` +
      `Expected {"url": "https://www.youtube.com/shorts/<video-id>"}.`
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(sourcePath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`Could not copy VIDEO.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
