-- Manual system tables migration
-- Adds support for page-based PDF manual with user notes and bookmarks

-- Manual pages table for PDF manual content
CREATE TABLE IF NOT EXISTS manual_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_number INTEGER NOT NULL UNIQUE,
    title TEXT,
    content TEXT,
    chapter TEXT,
    slug TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notes for manual pages
CREATE TABLE IF NOT EXISTS user_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- References auth.users(id) in Supabase
    page_id UUID REFERENCES manual_pages(id) ON DELETE CASCADE,
    note_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User bookmarks for manual pages
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- References auth.users(id) in Supabase
    page_id UUID REFERENCES manual_pages(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, page_id)
);

-- Enable RLS on new tables
ALTER TABLE manual_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manual_pages_page_number ON manual_pages(page_number);
CREATE INDEX IF NOT EXISTS idx_manual_pages_chapter ON manual_pages(chapter);
CREATE INDEX IF NOT EXISTS idx_manual_pages_slug ON manual_pages(slug);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_page_id ON user_notes(page_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_page_id ON user_bookmarks(page_id);

-- RLS Policies for manual pages
CREATE POLICY IF NOT EXISTS "Anyone can view manual pages" ON manual_pages
    FOR SELECT USING (true);

-- RLS Policies for user notes
CREATE POLICY IF NOT EXISTS "Users can view own notes" ON user_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own notes" ON user_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own notes" ON user_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own notes" ON user_notes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user bookmarks
CREATE POLICY IF NOT EXISTS "Users can view own bookmarks" ON user_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own bookmarks" ON user_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own bookmarks" ON user_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger for manual tables
CREATE OR REPLACE FUNCTION update_manual_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_manual_pages_updated_at 
    BEFORE UPDATE ON manual_pages 
    FOR EACH ROW EXECUTE FUNCTION update_manual_updated_at();

CREATE TRIGGER update_user_notes_updated_at 
    BEFORE UPDATE ON user_notes 
    FOR EACH ROW EXECUTE FUNCTION update_manual_updated_at();