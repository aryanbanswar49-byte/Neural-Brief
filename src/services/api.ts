import { supabase } from '../lib/supabase';
import { Post, Category, DashboardStats } from '../types';

// Helper: Calculate reading time in minutes based on average 200 WPM
export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Helper: Generate clean URL-safe slug from title
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// POSTS API SERVICE (SUPABASE POSTGRESQL)
// ============================================================================
export const postsApi = {
  async getPublishedPosts(limit?: number, offset: number = 0): Promise<{ data: Post[]; count: number }> {
    try {
      let query = supabase
        .from('posts')
        .select('*, category:categories(*), author:profiles(*)', { count: 'exact' })
        .eq('status', 'Published')
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.range(offset, offset + limit - 1);
      }

      const { data, count, error } = await query;
      if (error) throw error;
      return { data: (data as Post[]) || [], count: count || 0 };
    } catch (err) {
      console.error('[postsApi.getPublishedPosts error]', err);
      return { data: [], count: 0 };
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, category:categories(*), author:profiles(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return (data as Post) || null;
    } catch (err) {
      console.error('[postsApi.getPostBySlug error]', err);
      return null;
    }
  },

  async getPostsByCategory(categorySlug: string): Promise<{ category: Category | null; posts: Post[] }> {
    try {
      // 1. Fetch category by slug
      const { data: categoryData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (catError || !categoryData) return { category: null, posts: [] };

      // 2. Fetch published posts in category
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, category:categories(*), author:profiles(*)')
        .eq('category_id', categoryData.id)
        .eq('status', 'Published')
        .order('published_at', { ascending: false });

      if (postsError) throw postsError;
      return { category: categoryData as Category, posts: (postsData as Post[]) || [] };
    } catch (err) {
      console.error('[postsApi.getPostsByCategory error]', err);
      return { category: null, posts: [] };
    }
  },

  async searchPosts(searchQuery: string): Promise<Post[]> {
    if (!searchQuery.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, category:categories(*), author:profiles(*)')
        .eq('status', 'Published')
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return (data as Post[]) || [];
    } catch (err) {
      console.error('[postsApi.searchPosts error]', err);
      return [];
    }
  },

  async getRelatedPosts(categoryId: string, currentPostId: string, limit: number = 3): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, category:categories(*)')
        .eq('category_id', categoryId)
        .eq('status', 'Published')
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as Post[]) || [];
    } catch (err) {
      console.error('[postsApi.getRelatedPosts error]', err);
      return [];
    }
  },

  async getAllPostsAdmin(): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, category:categories(*), author:profiles(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as Post[]) || [];
    } catch (err) {
      console.error('[postsApi.getAllPostsAdmin error]', err);
      return [];
    }
  },

  async getPostById(id: string): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, category:categories(*), author:profiles(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return (data as Post) || null;
    } catch (err) {
      console.error('[postsApi.getPostById error]', err);
      return null;
    }
  },

  async createPost(postInput: Partial<Post>): Promise<Post> {
    const slug = postInput.slug?.trim() || generateSlug(postInput.title || 'untitled-article');
    const reading_time = calculateReadingTime(postInput.content || '');
    const isPublished = postInput.status === 'Published';
    
    // Get current authenticated user ID for author relation
    const { data: { user } } = await supabase.auth.getUser();

    const insertPayload = {
      title: postInput.title || '',
      slug,
      excerpt: postInput.excerpt || '',
      content: postInput.content || '',
      featured_image: postInput.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      category_id: postInput.category_id || null,
      author_id: user?.id || null,
      status: postInput.status || 'Draft',
      reading_time,
      meta_title: postInput.meta_title || postInput.title || null,
      meta_description: postInput.meta_description || postInput.excerpt || null,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([insertPayload])
      .select('*, category:categories(*), author:profiles(*)')
      .single();

    if (error) throw error;
    return data as Post;
  },

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const patchPayload: Record<string, any> = { ...updates };
    
    if (updates.content) {
      patchPayload.reading_time = calculateReadingTime(updates.content);
    }
    if (updates.title && !updates.slug) {
      patchPayload.slug = generateSlug(updates.title);
    }
    if (updates.status === 'Published' && !updates.published_at) {
      patchPayload.published_at = new Date().toISOString();
    }

    // Clean joined nested objects before sending update to Postgres
    delete patchPayload.category;
    delete patchPayload.author;

    const { data, error } = await supabase
      .from('posts')
      .update(patchPayload)
      .eq('id', id)
      .select('*, category:categories(*), author:profiles(*)')
      .single();

    if (error) throw error;
    return data as Post;
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadFeaturedImage(file: File): Promise<string> {
    // Validate MIME format
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      throw new Error('Invalid file format. Please upload a JPEG, PNG, WebP, or GIF image.');
    }

    // Validate size limit (< 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds the 5MB limit.');
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `posts/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};

// ============================================================================
// CATEGORIES API SERVICE (SUPABASE POSTGRESQL)
// ============================================================================
export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, posts:posts(id, status)')
        .order('name', { ascending: true });

      if (error) throw error;

      return (data || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        created_at: cat.created_at,
        post_count: (cat.posts || []).filter((p: any) => p.status === 'Published').length,
      }));
    } catch (err) {
      console.error('[categoriesApi.getCategories error]', err);
      return [];
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return (data as Category) || null;
    } catch (err) {
      console.error('[categoriesApi.getCategoryBySlug error]', err);
      return null;
    }
  },

  async createCategory(input: { name: string; slug?: string; description?: string }): Promise<Category> {
    const slug = input.slug?.trim() || generateSlug(input.name);

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: input.name,
        slug,
        description: input.description || '',
      }])
      .select('*')
      .single();

    if (error) throw error;
    return data as Category;
  },

  async updateCategory(id: string, updates: { name?: string; slug?: string; description?: string }): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data as Category;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ============================================================================
// STATS API SERVICE (SUPABASE POSTGRESQL AGGREGATION)
// ============================================================================
export const statsApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [{ count: totalPosts }, { count: publishedCount }, { count: draftsCount }, { count: totalCategories }] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'Published'),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'Draft'),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
      ]);

      return {
        totalPosts: totalPosts || 0,
        publishedCount: publishedCount || 0,
        draftsCount: draftsCount || 0,
        totalCategories: totalCategories || 0,
      };
    } catch (err) {
      console.error('[statsApi.getDashboardStats error]', err);
      return {
        totalPosts: 0,
        publishedCount: 0,
        draftsCount: 0,
        totalCategories: 0,
      };
    }
  }
};

// ============================================================================
// NEWSLETTER & CONTACT API SERVICES (SUPABASE POSTGRESQL)
// ============================================================================
export const newsletterApi = {
  async subscribe(email: string): Promise<{ success: boolean; message?: string }> {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        if (error.code === '23505') {
          return { success: true, message: 'You are already subscribed to our weekly digest!' };
        }
        throw error;
      }
      return { success: true };
    } catch (err: any) {
      console.error('[newsletterApi.subscribe error]', err);
      return { success: false, message: 'Subscription failed. Please try again.' };
    }
  }
};

export const contactApi = {
  async sendMessage(data: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; message?: string }> {
    if (!data.name || !data.email || !data.message) {
      return { success: false, message: 'Please complete all required fields.' };
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          subject: data.subject.trim(),
          message: data.message.trim(),
        }]);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('[contactApi.sendMessage error]', err);
      return { success: false, message: 'Failed to send message. Please try again.' };
    }
  }
};
