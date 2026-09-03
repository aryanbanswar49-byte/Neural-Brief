import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOMetadata } from '../types';

interface SEOProps extends SEOMetadata {
  title?: string;
  description?: string;
  slug?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  authorName?: string;
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'Neural Brief | High-Clarity Design & Technology Journal';
const DEFAULT_DESCRIPTION = 'A curated digital publication exploring contemporary architecture, minimalist living spaces, culture, and interface design.';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://theeditorial.com').replace(/\/$/, '');

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  slug = '',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  publishedTime,
  authorName = 'Neural Brief Desk',
  noIndex = false,
  structuredData,
}) => {
  const fullTitle = title 
    ? (title.includes('Neural Brief') ? title : `${title} | Neural Brief`)
    : DEFAULT_TITLE;
    
  const canonicalUrl = slug ? `${SITE_URL}/${slug.replace(/^\//, '')}` : SITE_URL;

  // Generate Schema.org JSON-LD structured data
  const jsonLd = structuredData || (
    ogType === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': title,
          'description': description,
          'image': [ogImage],
          'datePublished': publishedTime || new Date().toISOString(),
          'author': {
            '@type': 'Person',
            'name': authorName,
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Neural Brief',
            'logo': {
              '@type': 'ImageObject',
              'url': `${SITE_URL}/favicon.svg`,
            },
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'Neural Brief',
          'url': SITE_URL,
          'description': DEFAULT_DESCRIPTION,
        }
  );

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots Directive */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content="Neural Brief" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {authorName && <meta property="article:author" content={authorName} />}

      {/* Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};
