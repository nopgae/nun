# 눈 (Nun) — Public Camera Map

An interactive map of South Korea that plays **publicly available** camera feeds: tourist webcams on YouTube and, with a free government API key, national traffic CCTV snapshots. Click a marker to open the feed. (`눈` means "eye".)

Only open, public sources are used: the national ITS traffic-CCTV open API and public YouTube live streams. No private or access-controlled cameras.

## What it does

- Leaflet map with marker clustering, region filter, and search
- 11 bundled webcam locations (YouTube live streams, listed in `src/data/cameras-korea.json`; checked embeddable on 2026-10-30)
- With `DATA_GO_KR_API_KEY` set, the server also loads city and expressway traffic CCTVs from the ITS open API (`server/services/itsApi.ts`), with an in-memory cache
- Express backend proxies snapshot images for cameras in its own list only, so the browser doesn't hit CORS errors

## Run locally

```bash
npm install
cp .env.example .env     # optional: DATA_GO_KR_API_KEY from https://www.its.go.kr
npm run dev:all          # Vite on :5173, API on :3001
npm run build            # type-check + production build
```

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Leaflet / react-leaflet · hls.js · Express (tsx)

## Limitations

- Without an ITS API key, the map only has the 11 bundled YouTube webcams; streams can go offline without notice.
- No automated tests. Feed availability is checked by hand with `npm run db:validate`.
- Not deployed; runs locally only.
