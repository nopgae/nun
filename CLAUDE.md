# 눈 (Nun) — Real-Time Public Camera Map Viewer

## Project Overview

**Nun (눈)** — meaning "eye" in Korean. A web application inspired by the "God's Eye" concept from Fast & Furious. Users interact with an interactive world map — clicking on any marked location loads and displays a real-time public camera feed from that area. The project starts with South Korea and expands globally.

**This is NOT a surveillance/hacking tool.** It aggregates only **publicly available** camera feeds (traffic cams, tourist webcams, YouTube live streams, government open data). All data sources must be legal and publicly accessible.

## Tech Stack

- **Frontend**: React + TypeScript (Vite)
- **Map**: Leaflet.js with OpenStreetMap tiles (free, no API key needed)
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express (API proxy for camera feeds)
- **Database**: SQLite (via better-sqlite3) for camera location metadata
- **Deployment**: Docker (optional)

## Project Structure

```
nun/
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   └── favicon.svg               # 눈 eye icon
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── camera.ts          # Camera, Region, FeedSource types
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.tsx      # Main Leaflet map wrapper
│   │   │   ├── CameraMarker.tsx      # Individual camera pin on map
│   │   │   ├── CameraCluster.tsx     # Marker clustering for dense areas
│   │   │   └── MapControls.tsx       # Zoom, layer toggle, search
│   │   ├── Feed/
│   │   │   ├── FeedViewer.tsx        # Main feed display panel
│   │   │   ├── FeedPlayer.tsx        # Video/stream player component
│   │   │   ├── FeedInfo.tsx          # Camera metadata overlay
│   │   │   └── FeedGrid.tsx          # Multi-feed grid view
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx           # Main sidebar container
│   │   │   ├── CameraList.tsx        # List of nearby cameras
│   │   │   ├── RegionFilter.tsx      # Filter by region/city
│   │   │   └── SearchBar.tsx         # Search cameras by name/location
│   │   └── UI/
│   │       ├── LoadingOverlay.tsx     # "Scanning..." loading animation
│   │       ├── HUDOverlay.tsx        # Nun-style sci-fi HUD overlay on map
│   │       └── StatusBar.tsx         # Connection status, camera count
│   ├── hooks/
│   │   ├── useMap.ts                 # Map state and interactions
│   │   ├── useCameras.ts            # Camera data fetching/filtering
│   │   └── useFeed.ts               # Feed stream management
│   ├── services/
│   │   ├── cameraService.ts         # API calls for camera data
│   │   ├── feedService.ts           # Stream URL resolution
│   │   └── geocodingService.ts      # Reverse geocoding for clicked locations
│   ├── data/
│   │   ├── cameras-korea.json       # South Korea camera database
│   │   ├── cameras-global.json      # Global camera database (Phase 2)
│   │   └── regions.json             # Region/city metadata
│   └── utils/
│       ├── coordinates.ts           # Geo math utilities
│       ├── feedParser.ts            # Parse different feed formats
│       └── constants.ts             # Map defaults, API endpoints
├── server/
│   ├── index.ts                     # Express server entry
│   ├── routes/
│   │   ├── cameras.ts               # Camera CRUD endpoints
│   │   ├── feeds.ts                 # Feed proxy/resolution
│   │   └── search.ts               # Location search
│   ├── services/
│   │   ├── cameraDb.ts              # SQLite camera database
│   │   ├── feedProxy.ts             # Proxy streams to avoid CORS
│   │   └── scraper.ts              # Discover new public cameras
│   └── data/
│       └── seed.sql                 # Initial camera data seed
└── scripts/
    ├── seed-cameras.ts              # Populate DB with known cameras
    ├── validate-feeds.ts            # Check which feeds are still alive
    └── discover-cameras.ts          # Find new public camera sources
```

## Data Model

### Camera

```typescript
interface Camera {
  id: string;
  name: string;                    // e.g., "서울 강남대로 CCTV"
  nameEn: string;                  // e.g., "Seoul Gangnam-daero CCTV"
  latitude: number;
  longitude: number;
  region: string;                  // e.g., "서울특별시"
  city: string;                    // e.g., "강남구"
  country: string;                 // "KR", "US", etc.
  feedUrl: string;                 // Direct stream URL or embed URL
  feedType: 'hls' | 'mjpeg' | 'youtube' | 'iframe' | 'image-refresh';
  source: string;                  // e.g., "ITS국가교통정보센터", "YouTube"
  sourceUrl: string;               // Original source page
  category: 'traffic' | 'weather' | 'tourist' | 'city' | 'nature' | 'port' | 'other';
  isActive: boolean;
  lastChecked: string;             // ISO timestamp
  thumbnailUrl?: string;
}
```

## Public Camera Data Sources (South Korea)

### Priority Sources (Phase 1 — South Korea)

1. **ITS 국가교통정보센터 (National Traffic Info Center)**
   - URL: https://www.its.go.kr
   - Type: Traffic CCTVs nationwide
   - Feed format: HLS streams, MJPEG
   - Coverage: Major highways, intersections across all of Korea
   - API: Open API available via data.go.kr

2. **서울시 교통정보 시스템 (Seoul TOPIS)**
   - URL: https://topis.seoul.go.kr
   - Type: Seoul metropolitan traffic cameras
   - Coverage: Seoul city roads and intersections

3. **한국도로공사 실시간 도로정보 (Korea Expressway Corporation)**
   - URL: https://www.ex.co.kr
   - Type: Expressway/highway cameras
   - Coverage: All Korean expressways

4. **YouTube Live Streams — South Korea**
   - Search: "서울 실시간" "부산 실시간" "제주 라이브"
   - Many 24/7 city/nature webcams available
   - Embed via YouTube iframe API

5. **공공데이터포털 (data.go.kr)**
   - URL: https://www.data.go.kr
   - Various government CCTV open APIs
   - Requires free API key registration

6. **Insecam / Webcamtaxi / EarthCam**
   - Aggregator sites with public webcams
   - Can reference for discovering Korean camera feeds
   - Use only cameras that are explicitly public

### Global Expansion Sources (Phase 2)

- **USA**: 511 traffic systems (Caltrans, NYCDOT, etc.)
- **Europe**: Windy.com webcams API, motorway cameras
- **Japan**: National highway cameras, YouTube live streams
- **Worldwide**: EarthCam, Webcamtaxi, Skyline Webcams

## Implementation Phases

### Phase 1: MVP — South Korea Map (Week 1-2)

- [ ] Set up React + Vite + Tailwind + Leaflet project
- [ ] Create interactive map centered on South Korea (lat: 36.5, lng: 127.5, zoom: 7)
- [ ] Seed database with 50-100 known Korean public camera locations
- [ ] Implement camera markers with clustering
- [ ] Click marker → show feed in side panel
- [ ] Support YouTube embeds and HLS streams
- [ ] Basic dark/sci-fi themed UI (God's Eye aesthetic)
- [ ] Image-refresh fallback for MJPEG/snapshot cameras

### Phase 2: Enhanced UX (Week 3-4)

- [ ] Click anywhere on map → find nearest camera(s) and show feed
- [ ] HUD overlay with scanning animation when searching
- [ ] Multi-feed grid view (watch 4-9 cameras at once)
- [ ] Search by city/region name (Korean + English)
- [ ] Camera category filters (traffic, tourist, weather, etc.)
- [ ] Feed health monitoring (mark dead feeds, auto-skip)
- [ ] Reverse geocoding on click to show area name

### Phase 3: Global Expansion (Week 5-8)

- [ ] Add global camera sources (start with Japan, USA, Europe)
- [ ] Region-based lazy loading of camera data
- [ ] User-submitted camera feeds (with moderation)
- [ ] Favorites / watchlist
- [ ] Feed recording/screenshot
- [ ] Mobile responsive layout

### Phase 4: Polish & Advanced Features (Week 9+)

- [ ] Satellite imagery base layer option
- [ ] Time-of-day aware feed suggestions
- [ ] AI-powered scene description (describe what the camera sees)
- [ ] Traffic density estimation from camera feeds
- [ ] Weather overlay integration
- [ ] Share camera view via URL
- [ ] PWA support

## UI/UX Design Guidelines

### Theme: "눈 (Nun)" Sci-Fi Aesthetic

- **Color palette**: Dark background (#0a0a0f), cyan accents (#00f0ff), green highlights (#00ff88), subtle grid lines
- **Map style**: Dark/satellite tile layer (e.g., CartoDB Dark Matter or Mapbox Dark)
- **Typography**: Monospace for data overlays (JetBrains Mono or similar), clean sans-serif for UI (Inter)
- **Animations**:
  - Pulsing rings on active camera markers
  - "Scanning..." ripple effect when clicking on map
  - Smooth panel transitions
  - Grid-line sweep animation on HUD overlay
- **Sound effects** (optional): Subtle sci-fi beeps on interactions
- **Feed viewer**: Rounded corners, subtle glow border matching accent color, metadata overlay (camera name, coordinates, timestamp)

### Layout

```
┌─────────────────────────────────────────────────────┐
│ [Status Bar: Camera Count | Region | Connection]    │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  Sidebar   │          Interactive Map               │
│  - Search  │     (Dark themed, camera markers)      │
│  - Filters │                                        │
│  - Camera  │        ◉ ◉    ◉                       │
│    List    │     ◉     ◉  ◉   ◉                    │
│            │        ◉       ◉                       │
│            │                                        │
│            ├────────────────────────────────────────┤
│            │      Feed Viewer Panel                 │
│            │  ┌──────────────────────────────┐      │
│            │  │   Live Camera Feed            │      │
│            │  │   [Camera Name] [Coords]      │      │
│            │  └──────────────────────────────┘      │
├────────────┴────────────────────────────────────────┤
│ [HUD Overlay: Coordinates | Zoom Level | Time]      │
└─────────────────────────────────────────────────────┘
```

## API Endpoints (Backend)

```
GET    /api/cameras                    # List all cameras (with pagination & filters)
GET    /api/cameras/:id                # Get single camera details
GET    /api/cameras/nearby?lat=&lng=   # Find cameras near coordinates
GET    /api/cameras/region/:region     # Get cameras by region
GET    /api/feeds/:cameraId/proxy      # Proxy feed stream (CORS bypass)
GET    /api/feeds/:cameraId/snapshot   # Get latest snapshot image
POST   /api/cameras/validate           # Check if a feed URL is alive
GET    /api/search?q=                  # Search cameras by name/location
GET    /api/regions                    # List available regions
```

## Key Technical Decisions

1. **Leaflet over Google Maps**: Free, no API key, open-source, great plugin ecosystem
2. **HLS.js for video streams**: Most Korean traffic cameras use HLS; hls.js handles playback in browser
3. **Backend proxy for feeds**: Many camera feeds don't have CORS headers; proxy through our Express server
4. **SQLite for MVP**: Simple, no setup, good enough for thousands of camera records. Migrate to PostgreSQL if scaling
5. **Image-refresh fallback**: Some cameras only provide JPEG snapshots; refresh every 1-3 seconds to simulate video
6. **YouTube iframe API**: For YouTube live streams; reliable, handles all player logic

## Commands

```bash
# Development
npm run dev          # Start Vite dev server (frontend)
npm run server       # Start Express backend
npm run dev:all      # Start both concurrently

# Database
npm run db:seed      # Seed camera database
npm run db:validate  # Check all feeds are alive

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Scripts
npm run discover     # Discover new public cameras
```

## Environment Variables

```env
# .env
VITE_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
VITE_API_BASE_URL=http://localhost:3001/api
DATA_GO_KR_API_KEY=your_api_key_here    # From data.go.kr (free registration)
YOUTUBE_API_KEY=your_youtube_api_key     # For discovering YouTube live streams
PORT=3001
```

## Legal & Ethical Guidelines

- **ONLY** use publicly available camera feeds
- **NEVER** attempt to access private/secured cameras
- **NEVER** implement person tracking or facial recognition
- Respect robots.txt and terms of service of data sources
- Comply with Korean PIPA (개인정보보호법) and global privacy laws
- Include clear disclaimer that this aggregates public feeds only
- Allow camera operators to request removal of their feed
- Do not store/record feeds unless explicitly allowed by source

## Coding Standards

- Use TypeScript strict mode
- Components: Functional with hooks, no class components
- State management: React Context + useReducer for global state (no Redux needed for MVP)
- Error boundaries around feed players
- Graceful fallbacks: if a feed fails, show last snapshot or "Camera Offline" placeholder
- All camera names should support both Korean (한국어) and English
- Use `react-leaflet` for map integration
- Lazy load feed players — only load when camera is selected
- Debounce map interactions (pan, zoom) to avoid excessive API calls

## Notes for Claude Code

- When adding new camera sources, always verify the feed URL is publicly accessible first
- Test HLS streams with: `ffprobe -i <url>` before adding to database
- Korean government APIs (data.go.kr) require URL-encoded API keys
- YouTube live stream embed format: `https://www.youtube.com/embed/<VIDEO_ID>?autoplay=1`
- For CORS issues, always route through the backend proxy at `/api/feeds/:id/proxy`
- CartoDB Dark Matter tiles are free and don't need an API key
- When seeding Korean cameras, use both Korean and English names for searchability
