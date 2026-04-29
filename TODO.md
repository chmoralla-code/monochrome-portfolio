# Implementation TODO

## Phase 1: Authentication System
- [ ] Create `src/lib/auth.ts` - Cookie-based username/password auth
- [ ] Create `src/middleware.ts` - Route protection for admin
- [ ] Update `src/app/admin/login/page.tsx` - Username/password login
- [ ] Update `src/app/admin/login/Login.module.css` - Add username field styling
- [ ] Update `src/app/admin/(dashboard)/layout.tsx` - Add logout button
- [ ] Update `src/app/admin/(dashboard)/AdminLayout.module.css` - Logout styling

## Phase 2: Supabase Client Fix
- [ ] Update `src/lib/supabase.ts` - Server and client clients
- [ ] Update `src/app/page.tsx` - Server-side data fetching with auth
- [ ] Fix all admin pages to use proper auth

## Phase 3: Admin Dashboard Completion
- [ ] Complete `src/app/admin/(dashboard)/profile/page.tsx`
- [ ] Complete `src/app/admin/(dashboard)/projects/page.tsx` - Add image upload
- [ ] Complete `src/app/admin/(dashboard)/experience/page.tsx`
- [ ] Complete `src/app/admin/(dashboard)/messages/page.tsx`

## Phase 4: Deployment Preparation
- [ ] Update `next.config.ts` - Vercel config
- [ ] Create `.env.local.example`
- [ ] Update `README.md` - Complete instructions
- [ ] Create `vercel.json`

## Phase 5: GitHub & Finalize
- [ ] Remove old git remote
- [ ] Create new GitHub repo
- [ ] Push to new repo
