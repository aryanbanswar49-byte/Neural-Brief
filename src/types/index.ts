export interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type PostStatus = 'Draft' | 'Published';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  authorId: string;
  status: PostStatus;
  createdAt: string;
  publishedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface DashboardStats {
  totalPosts: number;
  draftsCount: number;
  publishedCount: number;
  totalCategories: number;
}
