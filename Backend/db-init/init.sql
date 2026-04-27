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

INSERT INTO items (title, description, category, location, status, contact_info)
VALUES
  ('Umbrela neagra', 'Uitata in PII3', 'Accesorii', 'PII3', 'found', 'student1@example.com'),
  ('Caiet albastru', 'Gasit in biblioteca', 'Papetarie', 'Biblioteca centrala', 'found', 'student2@example.com'),
  ('Cască audio', 'Pierduta in sala E214', 'Electronice', 'E214', 'lost', 'student3@example.com')
ON CONFLICT DO NOTHING;