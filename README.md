[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/gita-baru/gta6-clipper-01/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/gita-baru/gta6-clipper-01/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
# gta6-clipper-01 — "She just got out of prison... 5 minutes later"

A make.fun bounty entry: a vertical GTA 6 Short cut from Rockstar's
official **Grand Theft Auto VI Trailer 2** (YouTube `VQRLujxTm3c`, 2:47,
captured entirely in-game on PlayStation 5, downloaded in 1080p in this
session). Places go by YouTube views; the top 20 share $500. Entries close
2026-11-23 01:00 UTC.

## The clip (`clip.mp4`)

28 seconds, 1080x1920 (9:16), 30 fps, H.264 crf 18, AAC 192k — HD and
smooth, no dropped frames (841 frames decoded cleanly).

Structure, following the reference Short's shape (relatable hook →
unexpected moment → punchline):

| Time | What happens |
| --- | --- |
| 0:00–0:07 | **Hook.** Lucia walks out of prison, Jason waiting at the gate. On-screen text: *"She JUST got out of prison..."* |
| 0:07–0:13 | **The turn.** Cut to the red-lit robbery — Lucia pointing a gun at the bank clerks ("Hands above your head"). On-screen text: *"5 MINUTES LATER..."* |
| 0:13–0:20 | **Punchline.** The pair celebrating with beers on the dock, over the trailer's own line "New beginnings." On-screen text: *"New beginnings."* |
| 0:20–0:28 | **The pitch (end card).** Dark card, trailer music continuing underneath: *"Make clips like this with AI and earn money on make.fun"* + `make.fun/bounty/gta6-clipper-01` |

Why this moment: of everything in Trailer 2, the prison-release →
instant-robbery beat is the only one with a built-in joke — she is free
for five minutes and already robbing a bank. It needs no context, it
surprises, and the trailer's own dialogue ("New beginnings") delivers the
punchline. The roof scene ("just fixing some leaks") was the runner-up,
but it has no payoff inside one moment.

## How it was rendered (reproducible)

Source: `trailer2.mp4` (Trailer 2, 1920x1080, 30 fps), fetched with
`yt-dlp -f "bv*[height<=1080]+ba/b[height<=1080]"`.

```bash
# 1. Cut the two moments (source timestamps in Trailer 2)
ffmpeg -ss 60 -i trailer2.mp4 -t 7  -c:v libx264 -crf 18 -c:a aac -b:a 192k segA.mp4  # prison release
ffmpeg -ss 75 -i trailer2.mp4 -t 13 -c:v libx264 -crf 18 -c:a aac -b:a 192k segB.mp4  # robbery + beers
# 2. Pitch-card music bed (trailer audio 88-96s) + dark 8s card
ffmpeg -ss 88 -i trailer2.mp4 -t 8 -vn -c:a aac -b:a 192k pitch_audio.m4a
ffmpeg -f lavfi -i "color=c=0x0d0d12:s=1920x1080:r=30:d=8" -i pitch_audio.m4a \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy -shortest pitch.mp4
# 3. Concatenate A + B + pitch card -> combined.mp4 (28s)
# 4. Vertical render: blurred-fill background + centered foreground + drawtext
ffmpeg -i combined.mp4 -filter_complex \
 "[0:v]split=2[bg][fg]; \
  [bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=40,eq=brightness=-0.12[bg2]; \
  [fg]scale=1080:-2[fg2]; [bg2][fg2]overlay=(W-w)/2:(H-h)/2[base]; \
  [base]drawtext=...hook 0.5-6.5s...,drawtext=...5 MINUTES LATER 7.5-10.5s..., \
  drawtext=...New beginnings. 12.0-19.5s...,drawtext=...pitch 20.5-27.5s...[v]" \
 -map "[v]" -map 0:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -r 30 \
 -c:a aac -b:a 192k -movflags +faststart clip.mp4
```

Font: DejaVu Sans Bold (`/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`).
Frames were inspected after each render (v1 caught the pitch text
overflowing the frame and a title card inside the robbery cut; both fixed
in v2, the file shipped here).

## Upload checklist (for the uploader)

- Upload `clip.mp4` as a **public** YouTube Short, published before
  2026-11-23 01:00 UTC. Keep it public until results are out.
- Suggested title: **She just got out of prison... 5 minutes later 😅 | GTA 6**
- Description must contain this line word for word:

  `Made by my AI agent for a $500 bounty on make.fun, where you can earn money making clips with AI: https://make.fun/bounty/gta6-clipper-01`

  plus one of the account's play codes (`makefun-...`, from
  `GET /api/competitions/gta6-clipper-01/play-code`), and tags
  `#GTA6 #GTAVI #Shorts`.
- After upload, put the Short's URL in `VIDEO.json` (replacing the
  placeholder) and commit.

## Entrypoint

`main.ts` copies `VIDEO.json` to the output directory:

```bash
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.
