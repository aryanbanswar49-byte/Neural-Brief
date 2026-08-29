# Project Architecture: Simple Blog CMS

## 1. Overview
A React-based blog platform with a public-facing editorial site and a protected admin dashboard for content management.

## 2. Folder Structure
- `/components` - Reusable UI elements (Button, Input, Card, Table, Layout)
- `/pages`
  - `/public` - Homepage, Blog Listing, Post Detail
  - `/admin` - Dashboard, Post Management, Editor, Category Management
  - `/auth` - Login, Register
- `/context` - AuthContext for session management
- `/hooks` - Custom hooks for data fetching (simulated)
- `/types` - TypeScript interfaces

## 3. Data Structure
- **Admin**: id, name, email, password, createdAt
- **Post**: id, title, slug, excerpt, content, featuredImage, categoryId, authorId, status (Draft/Published), createdAt, publishedAt
- **Category**: id, name, description, createdAt

## 4. Authentication Flow
1. User submits login/register form.
2. Credentials validated.
3. AuthContext updated with user state.
4. Protected routes (Admin pages) redirect to Login if no user state exists.
5. Logout clears the state and redirects to Home.

## 5. Main Components
- **Navbar**: Public navigation with search.
- **Sidebar**: Admin-only navigation.
- **Editor**: Simple Markdown/Rich-text input for posts.
- **PostCard**: List/Grid item for blog browsing.
- **StatsCard**: Simple dashboard overview metrics.
