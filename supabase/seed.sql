-- ==============================================================================
-- THE EDITORIAL - SEED DATA FOR CATEGORIES & INITIAL ARTICLES
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, created_at)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Architecture', 'architecture', 'Stark forms, geometric lines, and structural aesthetics.', '2024-01-01T00:00:00Z'),
  ('c2222222-2222-2222-2222-222222222222', 'Interior', 'interior', 'Minimalist living spaces and functional design.', '2024-01-01T00:00:00Z'),
  ('c3333333-3333-3333-3333-333333333333', 'Culture', 'culture', 'Artisan crafts, social movements, and daily rituals.', '2024-01-01T00:00:00Z'),
  ('c4444444-4444-4444-4444-444444444444', 'Technology', 'technology', 'Human-centered digital design and interface aesthetics.', '2024-01-01T00:00:00Z'),
  ('c5555555-5555-5555-5555-555555555555', 'Nature', 'nature', 'Photographic essays and reflections on the wild.', '2024-01-01T00:00:00Z')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. SEED ARTICLES
INSERT INTO public.posts (
  id,
  title,
  slug,
  excerpt,
  content,
  featured_image,
  category_id,
  status,
  reading_time,
  meta_title,
  meta_description,
  published_at,
  created_at
)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'The Resurgence of Brutalism in Modern Urban Design',
    'brutalisim-resurgence-modern-urban-design',
    'Exploring why stark concrete forms and exposed structural elements are making a dramatic comeback in city centers worldwide, challenging our perceptions of beauty and utility.',
    'Brutalist architecture is experiencing a remarkable renaissance. Once widely dismissed as cold, imposing, and associated with post-war decay, the stark geometric structures of the mid-20th century are being re-evaluated through a modern lens. Today, architects and urban planners are embracing raw concrete, bold shapes, and honest, unadorned structural expressions.

### The Aesthetics of Honesty
At its core, Brutalism is about transparency. The term originates from the French *béton brut*, meaning raw concrete. Unlike buildings clad in glass or decorative panels, Brutalist structures lay their components bare. Support columns are visible, concrete retains the texture of the wooden molds it was poured into, and utility conduits are left exposed.

In a digital age characterized by slick, polished glass screens, this physical, tactile presence feels grounding. It offers a sense of permanence and architectural honesty that modern glass-and-steel skyscrapers often lack.

### Brutalism in Modern Practice
Modern adaptations of Brutalist design incorporate more natural light, greenery, and warmer textures to balance the heavy mass of concrete. By integrating public courtyards, living green walls, and generous glass openings, contemporary designers create spaces that feel powerful yet welcoming. Brutalism is no longer just a historical movement; it is a living philosophy of structural authenticity.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAfD-XDtoBlzsgxZTgtYEXgt5YHCPtWLDkeXlHZrpXrevsEHj8IiUsd42mKO7h8fEdODS7UTP-zihHvnEj4ifIuWQZPVxx_mY0TdD-nW5QHbpBuz9uWcg4R5XQ8AsdQxwgJCgHUCe6qK8Z7x_HrhiY7vNNBXhNU1e1u4I4IVVHJmy3f1mc51kSuY5PdeW3yNe_i1S6O5D5i3XvL6FM6yZAaDb2VhBWXfk72HZm6-GKP9W-5uwEUTK9Vog',
    'c1111111-1111-1111-1111-111111111111',
    'Published',
    6,
    'The Resurgence of Brutalism in Modern Urban Design | The Editorial',
    'Explore the renaissance of Brutalist architecture and how raw concrete forms are transforming modern city centers.',
    '2024-10-24T10:00:00Z',
    '2024-10-24T10:00:00Z'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Cultivating Calm: Minimalist Spaces for Focused Minds',
    'cultivating-calm-minimalist-spaces',
    'How reducing visual noise in your living environment can significantly lower stress levels and improve daily focus.',
    'Our environments shape our internal states. As the boundaries between work and rest continue to blur, our homes are increasingly filled with visual clutter that competes for our cognitive resources. Implementing minimalist design principles in your living space is not just an aesthetic choice—it is a powerful tool for cognitive restoration.

### The Cognitive Cost of Clutter
Neuroscientists at the Princeton Neuroscience Institute have found that visual clutter restricts your ability to focus and limits your brain''s capacity to process information. Visual noise acts like a constant, low-grade distraction, wearing down your mental energy over the course of the day.

### Designing a Minimalist Haven
To create a space that fosters focus and calm, consider the following elements:
1. **Intentional Surfaces:** Keep dining tables, desks, and countertops as clear as possible. Set up designated hidden storage for items not in active use.
2. **Restrained Color Palette:** Emphasize soft, natural tones like warm whites, stone grays, and natural wood. These colors reflect light softly and reduce visual stimulation.
3. **Dedicated Reading Columns:** Create a dedicated nook with comfortable lighting, a single chair, and zero digital screens. This provides a clear spatial boundary indicating it is time to slow down.

By reducing visual noise, we create breathing room for our thoughts, paving the way for deep focus and genuine relaxation.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCvjEZHqMb29Gm0pmXjSIDtpkwCv2e7aQMT6glwbomqMLjSCPPszZeK1kpS7UA8H9ztbHoZ1lGu_rSNdS6arnL2wszHIX83GyLUJrvCEpNWnP1FzTwRxCyQsk4clWXMlG6004SxevrLdP-qDesyUJeU9CyzAsuEXQgPaGUn1I2Uk-qYITIJvnLxAabU2dgH8OWV32hN_T01WLMgQeJ7QXnLT_lq20g-sCMGT8zn7WwYV9K154svONH86Q',
    'c2222222-2222-2222-2222-222222222222',
    'Published',
    5,
    'Cultivating Calm: Minimalist Spaces for Focused Minds | The Editorial',
    'Discover how reducing visual clutter in your home improves cognitive focus and lowers everyday stress.',
    '2024-10-22T09:00:00Z',
    '2024-10-22T09:00:00Z'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'The Nuance of the Third Wave Coffee Movement',
    'nuance-third-wave-coffee-movement',
    'Moving beyond mere caffeine delivery, how independent roasters are treating coffee with the reverence of fine wine.',
    'Coffee has evolved from a simple commodity to a complex, sensory craft. The Third Wave coffee movement represents a shift towards treating coffee as an artisanal product, focusing heavily on origin details, sustainable sourcing, roasting profiles, and meticulous brewing methods.

### Sourcing and Traceability
In the Third Wave, tracing a bean back to its specific farm, altitude, and processing station is standard practice. Roasters work directly with growers to secure high-quality harvests, paying premium prices that exceed fair trade minimums. This direct trade relationship ensures sustainability and incentivizes agricultural excellence.

### Micro-Roasting and Tasting Notes
Unlike the dark, heavy roasts characteristic of mass-market coffee, Third Wave roasters prefer light to medium profiles. This preserves the organic acids and delicate flavors inherent to the bean. A cup might taste of jasmine, stone fruit, or black tea, depending on its terroir and processing.

Brewing methods such as pour-overs, siphons, and precision espresso machines extract these notes cleanly. It encourages consumers to slow down, savor the temperature shifts, and treat the morning cup not as a utility, but as a ritual.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuByTfVoH9_5l4pFGKq_9dHuHIT8iOi7TTi_yvmbKBNDjUNFz0DVDsl2q0Aw2rIDXysNMp784HmCeurDydh5XjyUWZZ3yqfZEIwj3-UUXYEO5Na2nXylkK1gxmu6mAdahLU9jIbvqP83vr3qo6pDVKIAyPThmZlpjn9rXhD_4FKynL5_r4qaq_RCfJ8rkYJYQh9cpoor1cxWcARUInuBJ52DfVWHDL3jHyXE2M6qI_TXA9s6yo8ABAwMlQ',
    'c3333333-3333-3333-3333-333333333333',
    'Published',
    5,
    'The Nuance of the Third Wave Coffee Movement | The Editorial',
    'Explore how independent roasters treat artisanal coffee sourcing and single-origin profiles with culinary reverence.',
    '2024-10-18T14:30:00Z',
    '2024-10-18T14:30:00Z'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Glassmorphism: The Evolving Aesthetics of Interfaces',
    'glassmorphic-evolving-aesthetics-interfaces',
    'Tracing the origins and psychological impact of frosted glass effects in contemporary digital product design.',
    'Digital interfaces are constantly seeking ways to establish physical hierarchy. Glassmorphism—characterized by transparent, frosted panels floating over colorful backgrounds—has emerged as a major design trend, combining digital depth with realistic physical properties.

### The Principles of Glassmorphism
Glassmorphism relies on three main visual properties:
- **Translucency:** Frosted glass effect using backdrop-blur to show hints of underlying layers.
- **Tonal Layers:** Multi-layered hierarchy where active elements appear raised and floating.
- **Subtle Borders:** Extremely thin, light strokes bordering containers to define bounds without feeling heavy.

### Psychological Context
By mimicking physical surfaces, glassmorphic designs provide a familiar, reassuring visual cue to users. The subtle reveal of underlying colors makes the interface feel light, expansive, and cohesive, preventing layers from feeling completely isolated or disconnected.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDmAI3VWj3CXe5toETWkbQC4dMc_Ufxk1aUT-u5BxP8o9ly5gAvyUvQ6thOwH02YhI1R5r9-ieasDxsXBKEs1a8WyJkKR8dn0yWeDAexzrq5IAEU8momjMm06DW_uOopd1gIMiroTCyYPJwlDyuWmMmo9zppQavIEwJqk7QTDRcf9NT_WbgOAuuIdRmRkC08FPjxNtfQaeTeSPuXSPozzB3H4Y2o4noVk2pT5cRYNSfa3NwoWy-gwLL7w',
    'c4444444-4444-4444-4444-444444444444',
    'Published',
    4,
    'Glassmorphism: The Evolving Aesthetics of Interfaces | The Editorial',
    'An in-depth look at frosted glass styling, depth hierarchy, and visual psychology in modern digital UI design.',
    '2024-10-15T08:15:00Z',
    '2024-10-15T08:15:00Z'
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'Silence and Stone: Finding Solitude in High Altitudes',
    'silence-stone-solitude-high-altitudes',
    'A photographic essay documenting the quiet majesty of tree lines in remote, mountainous regions.',
    'Ascending past the tree line, the landscape shifts from rich green forests to stark, wind-swept stone. In this hostile yet beautiful environment, life moves at a glacial pace. This photographic essay documents the trees that survive at the absolute edge of biological capability.

### The Survival of Bristlecone Pines
At high altitudes, trees grow exceptionally slowly, producing dense, highly resinous wood that is nearly impervious to insects and rot. Some of these ancient pines have stood for over 4,000 years. Their twisted, weathered trunks bear witness to millennia of harsh winds, heavy snows, and relentless sunlight.

### The Beauty of Negative Space
Up here, the sky becomes the dominant architectural element. The lack of foliage means visual focus lands squarely on the contrast between rough dark barks and soft white clouds. It serves as a powerful reminder of how constraints and negative space can yield some of the most striking forms in nature.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Yey6aVStmVPPaa_XANpAV81UPM0zbFyFg2e4H22OZviH6GXYTx0AcAngKXSfszDoRuwfz4lAshG1raHfsbx2ABzkyl7sSf5VA7KJ6T9wggZH8mOX5gzKBz4caFnOdCxl9rFXiRXZ1kVfIt4w6z4lVPja2y6R_n2yjRVVWBxcesJdS1ERs0Fs1O8Den9IpXXUK69388-S_Zd1_kfJMVzd46W29CYYfvXfaO8it84fHI8sC_q7MlH1tg',
    'c5555555-5555-5555-5555-555555555555',
    'Published',
    5,
    'Silence and Stone: Finding Solitude in High Altitudes | The Editorial',
    'A photographic contemplation of ancient high-altitude pine ecosystems, resilience, and architectural negative space.',
    '2024-10-10T16:00:00Z',
    '2024-10-10T16:00:00Z'
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    'The Tactile Web: Reclaiming Physicality in Digital Interfaces',
    'the-tactile-web-reclaiming-physicality',
    'Why designers are moving away from flat, frictionless digital experiences in favor of texture, organic motion, and sensory weight.',
    'In our rush to optimize screens for pure speed and flat minimalism, digital spaces gradually lost their sense of substance. Every button looked identical, every surface had the same uniform smoothness, and interactions felt increasingly detached from our physical intuition. Today, a new wave of interface craft is emerging—one that treats pixels with the tactile reverence of paper, cloth, and stone.

### The Fatigue of Pure Flatness
For over a decade, flat design dominated software. While it stripped away garish skeuomorphism and simplified loading times, it also erased visual affordances. Interfaces became sterile, offering zero hints about depth, resistance, or material hierarchy. When everything is flat, nothing feels tangible.

### Designing with Weight and Resistance
Tactile design is not about returning to faux-leather textures or glossy plastic bevels. Rather, it is about respecting physical properties like inertia, friction, and light diffusion. When an element responds to touch with subtle resistance or casts an authentic ambient shadow, our brain registers it as a real, stable object rather than an ephemeral digital apparition.

### Looking Ahead: The Sensory Interface
As high-refresh displays and haptic engines mature, the boundary between physical craftsmanship and digital typography is closing. The future of interface design belongs to digital products that feel deliberate, weighted, and human.',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    'c4444444-4444-4444-4444-444444444444',
    'Published',
    5,
    'The Tactile Web: Reclaiming Physicality in Digital Interfaces | The Editorial',
    'Explore why modern designers are embracing texture, organic motion, and physical weight in digital interface design.',
    '2024-10-26T12:00:00Z',
    '2024-10-26T12:00:00Z'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  featured_image = EXCLUDED.featured_image,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  reading_time = EXCLUDED.reading_time,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  published_at = EXCLUDED.published_at;
