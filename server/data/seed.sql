CREATE TABLE IF NOT EXISTS cameras (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'KR',
  feed_url TEXT NOT NULL,
  feed_type TEXT NOT NULL CHECK (feed_type IN ('hls', 'mjpeg', 'youtube', 'iframe', 'image-refresh')),
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('traffic', 'weather', 'tourist', 'city', 'nature', 'port', 'other')),
  is_active INTEGER NOT NULL DEFAULT 1,
  last_checked TEXT NOT NULL,
  thumbnail_url TEXT
);

CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'KR',
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  zoom INTEGER NOT NULL DEFAULT 10
);

INSERT OR IGNORE INTO regions VALUES
  ('seoul', '서울특별시', 'Seoul', 'KR', 37.5665, 126.9780, 11),
  ('busan', '부산광역시', 'Busan', 'KR', 35.1796, 129.0756, 11),
  ('jeju', '제주특별자치도', 'Jeju', 'KR', 33.4996, 126.5312, 10),
  ('incheon', '인천광역시', 'Incheon', 'KR', 37.4563, 126.7052, 11),
  ('daegu', '대구광역시', 'Daegu', 'KR', 35.8714, 128.6014, 11),
  ('daejeon', '대전광역시', 'Daejeon', 'KR', 36.3504, 127.3845, 11),
  ('gwangju', '광주광역시', 'Gwangju', 'KR', 35.1595, 126.8526, 11),
  ('gyeonggi', '경기도', 'Gyeonggi', 'KR', 37.2750, 127.0094, 9),
  ('gangwon', '강원도', 'Gangwon', 'KR', 37.8228, 128.1555, 9),
  ('korea', '대한민국', 'South Korea', 'KR', 36.5, 127.5, 7);
