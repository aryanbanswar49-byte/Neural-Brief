export type UserRole = 'admin' | 'author' | 'reader';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type PostStatus = 'Draft' | 'Published';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  post_count?: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string | null;
  author_id: string | null;
  status: PostStatus;
  reading_time: number;
  meta_title?: string | null;
  meta_description?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined relational data
  category?: Category | null;
  author?: Profile | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface DashboardStats {
  totalPosts: number;
  draftsCount: number;
  publishedCount: number;
  totalCategories: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface SEOMetadata {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  authorName?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}
