-- Initial schema for LostNFound announcements

CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(255),
  found BOOLEAN DEFAULT FALSE,
  contact_info VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
