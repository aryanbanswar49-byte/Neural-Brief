import { Post, Category, DashboardStats } from '../types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Architecture', description: 'Stark forms, geometric lines, and structural aesthetics.', createdAt: '2024-01-01' },
  { id: 'cat-2', name: 'Interior', description: 'Minimalist living spaces and functional design.', createdAt: '2024-01-01' },
  { id: 'cat-3', name: 'Culture', description: 'Artisan crafts, social movements, and daily rituals.', createdAt: '2024-01-01' },
  { id: 'cat-4', name: 'Technology', description: 'Human-centered digital design and interface aesthetics.', createdAt: '2024-01-01' },
  { id: 'cat-5', name: 'Nature', description: 'Photographic essays and reflections on the wild.', createdAt: '2024-01-01' },
];

const DEFAULT_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'The Resurgence of Brutalism in Modern Urban Design',
    slug: 'brutalisim-resurgence-modern-urban-design',
    excerpt: 'Exploring why stark concrete forms and exposed structural elements are making a dramatic comeback in city centers worldwide, challenging our perceptions of beauty and utility.',
    content: `Brutalist architecture is experiencing a remarkable renaissance. Once widely dismissed as cold, imposing, and associated with post-war decay, the stark geometric structures of the mid-20th century are being re-evaluated through a modern lens. Today, architects and urban planners are embracing raw concrete, bold shapes, and honest, unadorned structural expressions.

### The Aesthetics of Honesty
At its core, Brutalism is about transparency. The term originates from the French *béton brut*, meaning raw concrete. Unlike buildings clad in glass or decorative panels, Brutalist structures lay their components bare. Support columns are visible, concrete retains the texture of the wooden molds it was poured into, and utility conduits are left exposed.

In a digital age characterized by slick, polished glass screens, this physical, tactile presence feels grounding. It offers a sense of permanence and architectural honesty that modern glass-and-steel skyscrapers often lack.

### Brutalism in Modern Practice
Modern adaptations of Brutalist design incorporate more natural light, greenery, and warmer textures to balance the heavy mass of concrete. By integrating public courtyards, living green walls, and generous glass openings, contemporary designers create spaces that feel powerful yet welcoming. Brutalism is no longer just a historical movement; it is a living philosophy of structural authenticity.`,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfD-XDtoBlzsgxZTgtYEXgt5YHCPtWLDkeXlHZrpXrevsEHj8IiUsd42mKO7h8fEdODS7UTP-zihHvnEj4ifIuWQZPVxx_mY0TdD-nW5QHbpBuz9uWcg4R5XQ8AsdQxwgJCgHUCe6qK8Z7x_HrhiY7vNNBXhNU1e1u4I4IVVHJmy3f1mc51kSuY5PdeW3yNe_i1S6O5D5i3XvL6FM6yZAaDb2VhBWXfk72HZm6-GKP9W-5uwEUTK9Vog',
    categoryId: 'cat-1',
    authorId: 'author-1',
    status: 'Published',
    createdAt: '2024-10-24T10:00:00.000Z',
    publishedAt: '2024-10-24T10:00:00.000Z'
  },
  {
    id: 'post-2',
    title: 'Cultivating Calm: Minimalist Spaces for Focused Minds',
    slug: 'cultivating-calm-minimalist-spaces',
    excerpt: 'How reducing visual noise in your living environment can significantly lower stress levels and improve daily focus.',
    content: `Our environments shape our internal states. As the boundaries between work and rest continue to blur, our homes are increasingly filled with visual clutter that competes for our cognitive resources. Implementing minimalist design principles in your living space is not just an aesthetic choice—it is a powerful tool for cognitive restoration.

### The Cognitive Cost of Clutter
Neuroscientists at the Princeton Neuroscience Institute have found that visual clutter restricts your ability to focus and limits your brain's capacity to process information. Visual noise acts like a constant, low-grade distraction, wearing down your mental energy over the course of the day.

### Designing a Minimalist Haven
To create a space that fosters focus and calm, consider the following elements:
1. **Intentional Surfaces:** Keep dining tables, desks, and countertops as clear as possible. Set up designated hidden storage for items not in active use.
2. **Restrained Color Palette:** Emphasize soft, natural tones like warm whites, stone grays, and natural wood. These colors reflect light softly and reduce visual stimulation.
3. **Dedicated Reading Columns:** Create a dedicated nook with comfortable lighting, a single chair, and zero digital screens. This provides a clear spatial boundary indicating it is time to slow down.

By reducing visual noise, we create breathing room for our thoughts, paving the way for deep focus and genuine relaxation.`,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvjEZHqMb29Gm0pmXjSIDtpkwCv2e7aQMT6glwbomqMLjSCPPszZeK1kpS7UA8H9ztbHoZ1lGu_rSNdS6arnL2wszHIX83GyLUJrvCEpNWnP1FzTwRxCyQsk4clWXMlG6004SxevrLdP-qDesyUJeU9CyzAsuEXQgPaGUn1I2Uk-qYITIJvnLxAabU2dgH8OWV32hN_T01WLMgQeJ7QXnLT_lq20g-sCMGT8zn7WwYV9K154svONH86Q',
    categoryId: 'cat-2',
    authorId: 'author-1',
    status: 'Published',
    createdAt: '2024-10-22T09:00:00.000Z',
    publishedAt: '2024-10-22T09:00:00.000Z'
  },
  {
    id: 'post-3',
    title: 'The Nuance of the Third Wave Coffee Movement',
    slug: 'nuance-third-wave-coffee-movement',
    excerpt: 'Moving beyond mere caffeine delivery, how independent roasters are treating coffee with the reverence of fine wine.',
    content: `Coffee has evolved from a simple commodity to a complex, sensory craft. The Third Wave coffee movement represents a shift towards treating coffee as an artisanal product, focusing heavily on origin details, sustainable sourcing, roasting profiles, and meticulous brewing methods.

### Sourcing and Traceability
In the Third Wave, tracing a bean back to its specific farm, altitude, and processing station is standard practice. Roasters work directly with growers to secure high-quality harvests, paying premium prices that exceed fair trade minimums. This direct trade relationship ensures sustainability and incentivizes agricultural excellence.

### Micro-Roasting and Tasting Notes
Unlike the dark, heavy roasts characteristic of mass-market coffee, Third Wave roasters prefer light to medium profiles. This preserves the organic acids and delicate flavors inherent to the bean. A cup might taste of jasmine, stone fruit, or black tea, depending on its terroir and processing.

Brewing methods such as pour-overs, siphons, and precision espresso machines extract these notes cleanly. It encourages consumers to slow down, savor the temperature shifts, and treat the morning cup not as a utility, but as a ritual.`,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByTfVoH9_5l4pFGKq_9dHuHIT8iOi7TTi_yvmbKBNDjUNFz0DVDsl2q0Aw2rIDXysNMp784HmCeurDydh5XjyUWZZ3yqfZEIwj3-UUXYEO5Na2nXylkK1gxmu6mAdahLU9jIbvqP83vr3qo6pDVKIAyPThmZlpjn9rXhD_4FKynL5_r4qaq_RCfJ8rkYJYQh9cpoor1cxWcARUInuBJ52DfVWHDL3jHyXE2M6qI_TXA9s6yo8ABAwMlQ',
    categoryId: 'cat-3',
    authorId: 'author-1',
    status: 'Published',
    createdAt: '2024-10-18T14:30:00.000Z',
    publishedAt: '2024-10-18T14:30:00.000Z'
  },
  {
    id: 'post-4',
    title: 'Glassmorphism: The Evolving Aesthetics of Interfaces',
    slug: 'glassmorphic-evolving-aesthetics-interfaces',
    excerpt: 'Tracing the origins and psychological impact of frosted glass effects in contemporary digital product design.',
    content: `Digital interfaces are constantly seeking ways to establish physical hierarchy. Glassmorphism—characterized by transparent, frosted panels floating over colorful backgrounds—has emerged as a major design trend, combining digital depth with realistic physical properties.

### The Principles of Glassmorphism
Glassmorphism relies on three main visual properties:
- **Translucency:** Frosted glass effect using backdrop-blur to show hints of underlying layers.
- **Tonal Layers:** Multi-layered hierarchy where active elements appear raised and floating.
- **Subtle Borders:** Extremely thin, light strokes bordering containers to define bounds without feeling heavy.

### Psychological Context
By mimicking physical surfaces, glassmorphic designs provide a familiar, reassuring visual cue to users. The subtle reveal of underlying colors makes the interface feel light, expansive, and cohesive, preventing layers from feeling completely isolated or disconnected.`,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmAI3VWj3CXe5toETWkbQC4dMc_Ufxk1aUT-u5BxP8o9ly5gAvyUvQ6thOwH02YhI1R5r9-ieasDxsXBKEs1a8WyJkKR8dn0yWeDAexzrq5IAEU8momjMm06DW_uOopd1gIMiroTCyYPJwlDyuWmMmo9zppQavIEwJqk7QTDRcf9NT_WbgOAuuIdRmRkC08FPjxNtfQaeTeSPuXSPozzB3H4Y2o4noVk2pT5cRYNSfa3NwoWy-gwLL7w',
    categoryId: 'cat-4',
    authorId: 'author-1',
    status: 'Published',
    createdAt: '2024-10-15T08:15:00.000Z',
    publishedAt: '2024-10-15T08:15:00.000Z'
  },
  {
    id: 'post-5',
    title: 'Silence and Stone: Finding Solitude in High Altitudes',
    slug: 'silence-stone-solitude-high-altitudes',
    excerpt: 'A photographic essay documenting the quiet majesty of tree lines in remote, mountainous regions.',
    content: `Ascending past the tree line, the landscape shifts from rich green forests to stark, wind-swept stone. In this hostile yet beautiful environment, life moves at a glacial pace. This photographic essay documents the trees that survive at the absolute edge of biological capability.

### The Survival of Bristlecone Pines
At high altitudes, trees grow exceptionally slowly, producing dense, highly resinous wood that is nearly impervious to insects and rot. Some of these ancient pines have stood for over 4,000 years. Their twisted, weathered trunks bear witness to millennia of harsh winds, heavy snows, and relentless sunlight.

### The Beauty of Negative Space
Up here, the sky becomes the dominant architectural element. The lack of foliage means visual focus lands squarely on the contrast between rough dark barks and soft white clouds. It serves as a powerful reminder of how constraints and negative space can yield some of the most striking forms in nature.`,
    featuredImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Yey6aVStmVPPaa_XANpAV81UPM0zbFyFg2e4H22OZviH6GXYTx0AcAngKXSfszDoRuwfz4lAshG1raHfsbx2ABzkyl7sSf5VA7KJ6T9wggZH8mOX5gzKBz4caFnOdCxl9rFXiRXZ1kVfIt4w6z4lVPja2y6R_n2yjRVVWBxcesJdS1ERs0Fs1O8Den9IpXXUK69388-S_Zd1_kfJMVzd46W29CYYfvXfaO8it84fHI8sC_q7MlH1tg',
    categoryId: 'cat-5',
    authorId: 'author-1',
    status: 'Published',
    createdAt: '2024-10-10T16:00:00.000Z',
    publishedAt: '2024-10-10T16:00:00.000Z'
  }
];

const LOCAL_STORAGE_POSTS_KEY = 'the_editorial_posts';
const LOCAL_STORAGE_CATEGORIES_KEY = 'the_editorial_categories';

export const db = {
  initialize() {
    if (!localStorage.getItem(LOCAL_STORAGE_POSTS_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    }
  },

  getPosts(): Post[] {
    this.initialize();
    const data = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getPublishedPosts(): Post[] {
    return this.getPosts()
      .filter(post => post.status === 'Published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPostBySlug(slug: string): Post | undefined {
    return this.getPosts().find(post => post.slug === slug);
  },

  getCategories(): Category[] {
    this.initialize();
    const data = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  savePosts(posts: Post[]) {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
  },

  addPost(postData: Omit<Post, 'id' | 'createdAt' | 'authorId'>): Post {
    const posts = this.getPosts();
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      authorId: 'author-1',
      createdAt: new Date().toISOString(),
      publishedAt: postData.status === 'Published' ? new Date().toISOString() : undefined,
    };
    posts.push(newPost);
    this.savePosts(posts);
    return newPost;
  },

  updatePost(id: string, updatedData: Partial<Omit<Post, 'id' | 'createdAt' | 'authorId'>>): Post {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    const currentPost = posts[index];
    const newStatus = updatedData.status !== undefined ? updatedData.status : currentPost.status;
    
    // Set publishedAt timestamp if status changed to Published
    let publishedAt = currentPost.publishedAt;
    if (newStatus === 'Published' && currentPost.status !== 'Published') {
      publishedAt = new Date().toISOString();
    } else if (newStatus === 'Draft') {
      publishedAt = undefined;
    }

    const updatedPost: Post = {
      ...currentPost,
      ...updatedData,
      publishedAt,
    };
    posts[index] = updatedPost;
    this.savePosts(posts);
    return updatedPost;
  },

  deletePost(id: string) {
    const posts = this.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    this.savePosts(filtered);
  },

  getStats(): DashboardStats {
    const posts = this.getPosts();
    const categories = this.getCategories();
    return {
      totalPosts: posts.length,
      draftsCount: posts.filter(p => p.status === 'Draft').length,
      publishedCount: posts.filter(p => p.status === 'Published').length,
      totalCategories: categories.length,
    };
  },

  reset() {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  }
};
