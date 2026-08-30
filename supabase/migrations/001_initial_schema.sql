-- ============================================================
-- 001_initial_schema.sql — The Global Tech Server Rack
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: slots
-- ============================================================
CREATE TABLE IF NOT EXISTS slots (
  id            INT PRIMARY KEY CHECK (id BETWEEN 1 AND 12),
  tier          TEXT NOT NULL DEFAULT 'blade' CHECK (tier IN ('master', 'blade')),
  current_bid   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  current_holder JSONB,
  -- holder shape: { name, handle, logo_url, company_url, bid_at }
  bid_deadline  TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'empty' CHECK (status IN ('empty', 'active', 'hot')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: bid_history
-- ============================================================
CREATE TABLE IF NOT EXISTS bid_history (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_id       INT NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  bidder_name   TEXT NOT NULL,
  bidder_handle TEXT NOT NULL,
  bidder_logo   TEXT,
  amount        NUMERIC(10, 2) NOT NULL,
  payment_id    TEXT UNIQUE NOT NULL,
  outbid_at     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: pending_bids
-- ============================================================
CREATE TABLE IF NOT EXISTS pending_bids (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_id              INT NOT NULL,
  amount               NUMERIC(10, 2) NOT NULL,
  bidder_info          JSONB NOT NULL,
  -- bidder_info shape: { name, handle, logo_url, company_url }
  checkout_session_id  TEXT UNIQUE NOT NULL,
  expires_at           TIMESTAMPTZ NOT NULL,
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SEED: Initialize all 12 slots
-- ============================================================
INSERT INTO slots (id, tier, current_bid, status) VALUES
  (1,  'master', 0, 'empty'),
  (2,  'blade',  0, 'empty'),
  (3,  'blade',  0, 'empty'),
  (4,  'blade',  0, 'empty'),
  (5,  'blade',  0, 'empty'),
  (6,  'blade',  0, 'empty'),
  (7,  'blade',  0, 'empty'),
  (8,  'blade',  0, 'empty'),
  (9,  'blade',  0, 'empty'),
  (10, 'blade',  0, 'empty'),
  (11, 'blade',  0, 'empty'),
  (12, 'blade',  0, 'empty')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TRIGGER: Auto-update updated_at on slots
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER slots_updated_at
  BEFORE UPDATE ON slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bid_history_slot_id ON bid_history(slot_id);
CREATE INDEX IF NOT EXISTS idx_bid_history_created_at ON bid_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pending_bids_session ON pending_bids(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_pending_bids_status ON pending_bids(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_bids ENABLE ROW LEVEL SECURITY;

-- Public can read slots and bid_history
CREATE POLICY "Public read slots" ON slots FOR SELECT USING (true);
CREATE POLICY "Public read bid_history" ON bid_history FOR SELECT USING (true);

-- Only service role can write (enforced by using service role key in webhook)
CREATE POLICY "Service role write slots" ON slots
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write bid_history" ON bid_history
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write pending_bids" ON pending_bids
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- REALTIME: Enable replication on slots table
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE slots;
ALTER PUBLICATION supabase_realtime ADD TABLE bid_history;
