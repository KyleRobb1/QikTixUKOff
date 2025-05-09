-- Create events table
CREATE TABLE IF NOT EXISTS events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  ticket_limit INTEGER DEFAULT 100,
  creator_id UUID REFERENCES auth.users(id),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event_id UUID NOT NULL REFERENCES events(event_id),
  ticket_type TEXT NOT NULL,
  purchase_price NUMERIC(10,2),
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  qr_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security policies

-- Allow public read access to events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);

-- Allow users to only see their own tickets
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can only create their own tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample event
INSERT INTO events (name, date, location, description, price, ticket_limit, creator_id)
VALUES ('Hamilton', CURRENT_TIMESTAMP + INTERVAL '30 days', 'Victoria Palace Theatre, London', 'The story of America then, told by America now', 125.00, 100, auth.uid()); 