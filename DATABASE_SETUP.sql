-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  experience_level VARCHAR(50) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  preferences JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Poses Table
CREATE TABLE poses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sanskrit_name VARCHAR(255),
  category VARCHAR(100),
  difficulty VARCHAR(50) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  description TEXT,
  benefits TEXT[],
  contraindications TEXT[],
  image_url VARCHAR(255),
  video_url VARCHAR(255)
);

-- Flows Table
CREATE TABLE flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration INT, -- in minutes
  difficulty VARCHAR(50) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  style VARCHAR(100),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Flow Sequences Table
CREATE TABLE flow_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID REFERENCES flows(id) ON DELETE CASCADE,
  pose_id UUID REFERENCES poses(id) ON DELETE SET NULL,
  "order" INT NOT NULL,
  duration INT, -- in seconds
  instructions TEXT
);

-- Practice Sessions Table
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  flow_id UUID REFERENCES flows(id) ON DELETE SET NULL,
  duration INT, -- in minutes
  date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5)
);

-- User Progress Table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric VARCHAR(100) NOT NULL,
  value INT NOT NULL,
  date TIMESTAMPTZ NOT NULL
);
