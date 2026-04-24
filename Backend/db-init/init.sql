CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'found', -- poate fi 'lost' sau 'found'
  contact_info VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);