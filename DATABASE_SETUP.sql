-- Yoga Flow University Database Schema
-- PostgreSQL 14+ recommended
-- Created: 2024
-- Purpose: Complete database structure for yoga platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE pose_category AS ENUM (
    'standing', 'seated', 'supine', 'prone', 'backbend',
    'forward_fold', 'twist', 'inversion', 'arm_balance',
    'hip_opener', 'core', 'balance', 'restorative', 'meditation'
);
CREATE TYPE practice_style AS ENUM (
    'hatha', 'vinyasa', 'yin', 'restorative', 'power',
    'ashtanga', 'kundalini', 'meditation', 'pranayama'
);
CREATE TYPE energy_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE mood_type AS ENUM (
    'calm', 'energized', 'focused', 'relaxed', 'tired',
    'stressed', 'happy', 'peaceful'
);
CREATE TYPE course_category AS ENUM (
    'anatomy', 'philosophy', 'teaching_methodology',
    'sequencing', 'adjustments', 'business', 'specialization'
);
CREATE TYPE lesson_type AS ENUM ('video', 'reading', 'quiz', 'practical', 'discussion');

-- ========================================
-- USERS & AUTHENTICATION
-- ========================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    role user_role DEFAULT 'student',
    experience_level difficulty_level DEFAULT 'beginner',
    preferences JSONB DEFAULT '{}',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User authentication (for NextAuth.js compatibility)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(provider, provider_account_id)
);

-- User sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- YOGA CONTENT
-- ========================================

-- Poses table
CREATE TABLE poses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sanskrit_name VARCHAR(255),
    category pose_category NOT NULL,
    difficulty difficulty_level NOT NULL,
    description TEXT NOT NULL,
    benefits TEXT[] DEFAULT '{}',
    contraindications TEXT[] DEFAULT '{}',
    instructions TEXT[] DEFAULT '{}',
    image_url TEXT,
    video_url TEXT,
    anatomy_focus TEXT[] DEFAULT '{}',
    energy_level energy_level DEFAULT 'medium',
    is_published BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Pose variations
CREATE TABLE pose_variations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pose_id UUID NOT NULL REFERENCES poses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty difficulty_level NOT NULL,
    image_url TEXT,
    instructions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Flows table
CREATE TABLE flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    difficulty difficulty_level NOT NULL,
    style practice_style NOT NULL,
    focus_areas TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0,
    practice_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Flow sequences (poses within a flow)
CREATE TABLE flow_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
    pose_id UUID NOT NULL REFERENCES poses(id),
    order_index INTEGER NOT NULL,
    duration INTEGER DEFAULT 30, -- in seconds
    instructions TEXT,
    transition_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- PRACTICE TRACKING
-- ========================================

-- Practice sessions
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flow_id UUID REFERENCES flows(id),
    duration INTEGER NOT NULL, -- actual duration in minutes
    completed_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    mood mood_type,
    energy energy_level,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric VARCHAR(100) NOT NULL, -- flexibility_score, strength_score, etc.
    value DECIMAL(10,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User goals
CREATE TABLE user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    target_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- LEARNING MANAGEMENT
-- ========================================

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category course_category NOT NULL,
    difficulty difficulty_level NOT NULL,
    duration INTEGER NOT NULL, -- in hours
    prerequisites TEXT[] DEFAULT '{}',
    certificate BOOLEAN DEFAULT FALSE,
    instructor_id UUID NOT NULL REFERENCES users(id),
    rating DECIMAL(3,2) DEFAULT 0,
    enrollment_count INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Course modules
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Course lessons
CREATE TABLE course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type lesson_type NOT NULL,
    content TEXT, -- HTML content, video URL, quiz JSON, etc.
    video_url TEXT,
    duration INTEGER DEFAULT 0, -- in minutes
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Lesson completions
CREATE TABLE lesson_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT NOW(),
    time_spent INTEGER DEFAULT 0, -- in minutes
    quiz_score INTEGER, -- for quiz lessons
    UNIQUE(user_id, lesson_id)
);

-- ========================================
-- COMMUNITY & SOCIAL
-- ========================================

-- User favorites (poses, flows, courses)
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    favoritable_type VARCHAR(50) NOT NULL, -- 'pose', 'flow', 'course'
    favoritable_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, favoritable_type, favoritable_id)
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewable_type VARCHAR(50) NOT NULL, -- 'flow', 'course'
    reviewable_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, reviewable_type, reviewable_id)
);

-- ========================================
-- SYSTEM & ADMIN
-- ========================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(100) NOT NULL, -- practice_reminder, goal_achievement, etc.
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Pose indexes
CREATE INDEX idx_poses_category ON poses(category);
CREATE INDEX idx_poses_difficulty ON poses(difficulty);
CREATE INDEX idx_poses_published ON poses(is_published);

-- Flow indexes
CREATE INDEX idx_flows_user_id ON flows(user_id);
CREATE INDEX idx_flows_public ON flows(is_public);
CREATE INDEX idx_flows_difficulty ON flows(difficulty);
CREATE INDEX idx_flows_style ON flows(style);

-- Practice session indexes
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_date ON practice_sessions(completed_at);
CREATE INDEX idx_practice_sessions_flow_id ON practice_sessions(flow_id);

-- Course indexes
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);

-- Enrollment indexes
CREATE INDEX idx_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON course_enrollments(course_id);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poses_updated_at BEFORE UPDATE ON poses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON flows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update flow rating when new review is added
CREATE OR REPLACE FUNCTION update_flow_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE flows
    SET rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM reviews
        WHERE reviewable_type = 'flow' AND reviewable_id = NEW.reviewable_id
    )
    WHERE id = NEW.reviewable_id AND NEW.reviewable_type = 'flow';
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for flow rating updates
CREATE TRIGGER update_flow_rating_trigger
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW
    WHEN (NEW.reviewable_type = 'flow')
    EXECUTE FUNCTION update_flow_rating();

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- View for user dashboard stats
CREATE VIEW user_dashboard_stats AS
SELECT
    u.id as user_id,
    u.name,
    COUNT(DISTINCT ps.id) as total_sessions,
    COALESCE(SUM(ps.duration), 0) as total_practice_time,
    COUNT(DISTINCT f.id) as saved_flows,
    COUNT(DISTINCT ce.id) as enrolled_courses,
    COUNT(DISTINCT CASE WHEN ps.completed_at >= CURRENT_DATE - INTERVAL '7 days' THEN ps.id END) as sessions_this_week
FROM users u
LEFT JOIN practice_sessions ps ON u.id = ps.user_id
LEFT JOIN flows f ON u.id = f.user_id
LEFT JOIN course_enrollments ce ON u.id = ce.user_id
GROUP BY u.id, u.name;

-- View for pose library with stats
CREATE VIEW pose_library_view AS
SELECT
    p.*,
    COUNT(DISTINCT fs.flow_id) as used_in_flows,
    COUNT(DISTINCT uf.user_id) as favorited_by_users
FROM poses p
LEFT JOIN flow_sequences fs ON p.id = fs.pose_id
LEFT JOIN user_favorites uf ON p.id = uf.favoritable_id AND uf.favoritable_type = 'pose'
WHERE p.is_published = true
GROUP BY p.id;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Yoga Flow University database schema created successfully!';
    RAISE NOTICE '📊 Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE '🔧 Functions created: %', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION');
    RAISE NOTICE '⚡ Triggers created: %', (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public');
    RAISE NOTICE '👁️ Views created: %', (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public');
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update your .env.local with the database connection string';
    RAISE NOTICE '2. Run the Next.js application: npm run dev';
    RAISE NOTICE '3. Visit http://localhost:3000 to see the platform';
    RAISE NOTICE '';
    RAISE NOTICE 'Happy coding! 🧘‍♀️';
END $$;
