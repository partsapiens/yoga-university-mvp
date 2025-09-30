import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoga-university.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/dashboard', // Private user area
          '/journal/', // Private user content
          '/reading/', // Private user content
          '/.well-known/', // Security files
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard', // Private user area
          '/journal/', // Private user content
          '/reading/', // Private user content
        ],
        // Crawl-delay for non-critical pages to avoid overwhelming server
        crawlDelay: 1,
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard', // Private user area
          '/journal/', // Private user content
          '/reading/', // Private user content
        ],
        // Allow faster crawling for AdSense verification
      },
      {
        userAgent: 'GPTBot', // OpenAI bot
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard', // Private user area
          '/journal/', // Private user content
          '/reading/', // Private user content
        ],
      },
      {
        userAgent: 'Google-Extended', // Google AI training
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard', // Private user area
          '/journal/', // Private user content
          '/reading/', // Private user content
        ],
      },
      {
        userAgent: 'ClaudeBot', // Anthropic Claude
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard', // Private user area
          '/journal/', // Private user content
          '/reading/', // Private user content
        ],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard', // Private user area
          '/journal/', // Private user content
          '/reading/', // Private user content
        ],
      },
      {
        userAgent: 'BingBot', // Microsoft Bing
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard', // Private user area
          '/journal/', // Private user content
          '/reading/', // Private user content
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}