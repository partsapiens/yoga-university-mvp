import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcoqofytqpjjjradpqfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jb3FvZnl0cXBqampyYWRwcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwODgzNjcsImV4cCI6MjA3MjY2NDM2N30.Wm_RwyJs8pobxmQ-2M6or_50k-61y1SxpJX7CPE0to8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);