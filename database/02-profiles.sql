CREATE TABLE profiles (
  -- Linked 1 to 1 with Supabase authentication table
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'patient',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);
