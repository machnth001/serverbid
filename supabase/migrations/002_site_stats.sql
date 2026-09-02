-- ============================================================
-- 002_site_stats.sql — Visitor Counter & Site Traffic Stats
-- ============================================================

CREATE TABLE IF NOT EXISTS site_stats (
  key TEXT PRIMARY KEY,
  value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial total visitors counter if not exists
INSERT INTO site_stats (key, value)
VALUES ('total_visitors', 1)
ON CONFLICT (key) DO NOTHING;

-- ROW LEVEL SECURITY
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_stats" ON site_stats FOR SELECT USING (true);
CREATE POLICY "Service role write site_stats" ON site_stats FOR ALL USING (auth.role() = 'service_role');
