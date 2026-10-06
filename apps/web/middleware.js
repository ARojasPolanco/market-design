import { next } from '@vercel/edge';

const SITE_URL = 'https://marketdesign.shop';
const API_BASE = 'https://market-design.onrender.com/api';
const DEFAULT_IMAGE = `${SITE_URL}/marketDesignLogo.png`;

// Social/chat crawlers that do NOT execute JavaScript and rely on server HTML.
const BOT_PATTERN =
  /(whatsapp|facebookexternalhit|facebot|twitterbot|slackbot|telegrambot|discordbot|linkedinbot)/i;

const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);

const withOgSize = (imageUrl) => {
  if (!imageUrl) return DEFAULT_IMAGE;
  if (imageUrl.includes('res.cloudinary.com') && imageUrl.includes('/upload/')) {
    return imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_jpg/');
  }
  return imageUrl;
};

const buildMetaTags = ({ title, description, image, url }) => `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Market Design" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />`;

const genericMeta = (url) =>
  buildMetaTags({
    title: 'Market Design — Marketplace de diseños',
    description: 'Descubrí y comprá diseños digitales listos para imprimir.',
    image: DEFAULT_IMAGE,
    url,
  });

export default async function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = BOT_PATTERN.test(userAgent);
  const forcePrerender = url.searchParams.get('prerender') === '1';

  // Real browsers get the SPA untouched.
  if (!isBot && !forcePrerender) {
    return next();
  }

  const id = url.pathname.split('/').filter(Boolean).pop();
  const pageUrl = `${SITE_URL}/diseno/${id}`;

  let pageTitle = 'Market Design — Marketplace de diseños';
  let metaTags = genericMeta(pageUrl);

  try {
    const res = await fetch(`${API_BASE}/v1/designs/${id}`, {
      headers: { accept: 'application/json', 'x-prerender': '1' },
    });

    if (res.ok) {
      const { design } = await res.json();

      if (design && !design.isDeleted) {
        const seller = design.seller?.storeName || design.seller?.username || 'un vendedor';
        const category = design.category || 'diseño';
        const price = Number(design.price || 0).toLocaleString('es-AR');

        pageTitle = `${design.title} — Market Design`;
        metaTags = buildMetaTags({
          title: pageTitle,
          description: `Diseño de ${category} por ${seller} — $${price}`,
          image: withOgSize(design.previewUrl),
          url: pageUrl,
        });
      }
    }
  } catch {
    // Network/API failure → keep the generic site meta tags.
  }

  try {
    const htmlResponse = await fetch(new URL('/index.html', url.origin));
    let html = await htmlResponse.text();

    // Remove any pre-existing og:/twitter: tags to avoid duplicates, then inject.
    html = html.replace(
      /<meta[^>]+(?:property|name)=["'](?:og:|twitter:)[^"']*["'][^>]*>\s*/gi,
      ''
    );
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`);
    html = html.replace('</head>', `${metaTags}\n  </head>`);

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400',
      },
    });
  } catch {
    // If anything fails, serve the normal SPA instead of breaking the page.
    return next();
  }
}

export const config = {
  matcher: ['/diseno/:id'],
};
