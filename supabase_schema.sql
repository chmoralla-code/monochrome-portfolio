-- Create profile table
CREATE TABLE public.profile (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    name TEXT NOT NULL,
    bio TEXT,
    philosophy TEXT,
    avatar_url TEXT,
    email TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    year INTEGER,
    category TEXT,
    thumbnail_url TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create project_images table
CREATE TABLE public.project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create experience table
CREATE TABLE public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity TEXT NOT NULL,
    role TEXT,
    duration TEXT,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- Profile: Public read, Auth update
CREATE POLICY "Public profiles are viewable by everyone." ON public.profile FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profile FOR UPDATE USING (auth.uid() = id);

-- Projects: Public read, Auth all
CREATE POLICY "Projects are viewable by everyone." ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects." ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- Project Images: Public read, Auth all
CREATE POLICY "Project images are viewable by everyone." ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage project images." ON public.project_images FOR ALL USING (auth.role() = 'authenticated');

-- Experience: Public read, Auth all
CREATE POLICY "Experience is viewable by everyone." ON public.experience FOR SELECT USING (true);
CREATE POLICY "Admins can manage experience." ON public.experience FOR ALL USING (auth.role() = 'authenticated');

-- Messages: Auth read/delete, Public insert
CREATE POLICY "Admins can view messages." ON public.messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can send a message." ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete messages." ON public.messages FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Setup (Bucket creation must be done via Dashboard or CLI usually, but policies can be scripted)
-- Assuming 'architectural_gallery' bucket exists
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'architectural_gallery' );
-- CREATE POLICY "Admin Full Access" ON storage.objects FOR ALL USING ( auth.role() = 'authenticated' );
