# Monochrome Architectural Portfolio & Admin Dashboard

A premium, minimalist architectural portfolio with a full-featured admin dashboard for 100% content management.

## Features
- **Architectural Showcase**: Clean, monochrome design for high-impact project presentation.
- **Admin Dashboard**: Secure management of projects, images, profile, and inquiries.
- **Supabase Integration**: Auth, Database, and Storage (for large architectural renders).
- **Responsive**: Fully optimized for desktop and mobile.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Supabase (Database, Auth, Storage)
- Vanilla CSS (Custom CSS Modules)
- Lucide React

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd monochrome-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Supabase Configuration**:
   - Create a new project on [Supabase](https://supabase.com/).
   - Go to the SQL Editor and run the contents of `supabase_schema.sql`.
   - Create a Storage bucket named `architectural_gallery` and set it to public.
   - Go to Project Settings > API and copy your URL and Keys.

4. **Environment Variables**:
   - Create a `.env.local` file in the root.
   - Copy the variables from `.env.example` and fill in your Supabase credentials.

5. **Run locally**:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Connect your GitHub account to [Vercel](https://vercel.com/).
3. Create a "New Project" and select this repository.
4. In the "Environment Variables" section, add all variables from your `.env.local`.
5. Click **Deploy**.

## Deployment to Supabase

The database and auth are already configured if you followed step 3 of the Setup Instructions. For production, ensure you set up your SMTP settings in Supabase to send professional authentication emails.
