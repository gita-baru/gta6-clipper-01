// gta6-clipper-01 entry: "She just got out of prison... 5 minutes later"
// A GTA 6 clip cut from Rockstar's official Trailer 2, rendered vertical
// (1080x1920, 30fps) with ffmpeg in this session, uploaded to YouTube as a
// public Short. The video is the entry: the house reads its views through
// the YouTube Data API, and the top 20 most-viewed videos share $500.
//
// This program is the whole entrypoint. It copies VIDEO.json (the address
// of the uploaded Short) from the repository into the grader's output
// directory, where the gate reads it. It does no network access, reads no
// clock and touches no files outside the repository, so repeated runs
// write identical bytes.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`Could not copy VIDEO.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
