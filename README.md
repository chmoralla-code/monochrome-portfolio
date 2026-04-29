# Monochrome Architectural Portfolio & Admin Dashboard

A premium, minimalist architectural portfolio with a full-featured admin dashboard for 100% content management. Built with Next.js, Supabase, and custom cookie-based authentication.

## Features
- **Architectural Showcase**: Clean, monochrome brutalist design for high-impact project presentation.
- **Admin Dashboard**: Secure management of projects, images, profile, experience, and inquiries.
- **Image Uploads**: Direct image uploads to Supabase Storage from the admin panel.
- **Custom Authentication**: Simple cookie-based auth (no complex Supabase Auth setup required).
- **Responsive**: Fully optimized for desktop and mobile.
- **Deploy Ready**: Configured for Render and Supabase deployment.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Supabase (Database, Storage)
- Custom Cookie-Based Authentication
- CSS Modules (Vanilla CSS)
- Lucide React

## Admin Dashboard
- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `admin1234`

The admin dashboard lets you:
- Edit your profile (name, bio, philosophy, email)
- Manage projects (add, edit, delete with image uploads)
- Manage experience/awards
- View and manage contact form messages

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd monochrome-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Supabase Configuration
- This project uses Supabase project: `jhufojelzctorfycoohh`
- Go to the Supabase Dashboard SQL Editor and run the contents of `supabase_schema.sql`
- The storage bucket `portfolio-images` will be created automatically on first upload
- Go to Project Settings > API and copy your Anon Key and Service Role Key

### 4. Environment Variables
Create a `.env.local` file in the root with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jhufojelzctorfycoohh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Run locally
```bash
npm run dev
```

Visit `http://localhost:3000` for the portfolio and `http://localhost:3000/admin` for the dashboard.

## Deployment to Render

### Option 1: Blueprint (render.yaml)
1. Push your code to GitHub
2. In the Render Dashboard, click **New +** → **Blueprint**
3. Connect your GitHub repo and select `monochrome-portfolio`
4. Render will read `render.yaml` and configure the service automatically
5. Add your environment variables in the Render dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://jhufojelzctorfycoohh.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
6. Click **Apply** to deploy

### Option 2: Manual Web Service
1. Push your code to GitHub
2. In the Render Dashboard, click **New +** → **Web Service**
3. Connect your GitHub repo and select `monochrome-portfolio`
4. Configure:
   - **Name**: `monochrome-portfolio`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://jhufojelzctorfycoohh.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
6. Click **Create Web Service**

### Your Existing Render Service
If you already have a Render service at:
`https://dashboard.render.com/web/srv-d7p07tu7r5hc73ah6bug/`

1. Go to that service in your Render dashboard
2. Check that it's connected to your GitHub repo
3. Verify the build command is: `npm install && npm run build`
4. Verify the start command is: `npm start`
5. Add the environment variables listed above
6. Push to the connected branch to trigger auto-deploy

## Database Schema

The Supabase database includes these tables:
- `profile` - Personal information and bio
- `projects` - Portfolio projects with images
- `project_images` - Additional project images (gallery)
- `experience` - Work experience and awards
- `messages` - Contact form submissions

## Authentication

This project uses a simple cookie-based authentication system for the admin dashboard:
- No email verification or complex auth flows
- Secure HTTP-only cookies
- Protected routes via middleware
- Session expires after 24 hours

For production, consider migrating to a more robust auth solution.

## Storage

Images are uploaded to Supabase Storage bucket `portfolio-images`:
- Automatically created on first upload
- Public access for portfolio display
- 5MB file size limit
- Supported formats: JPEG, PNG, WebP, GIF

## Support

For issues or questions, please open an issue on the GitHub repository.
