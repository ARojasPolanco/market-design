// Lightweight anti-bot heuristics for the public beta signup form.
// Conservative on purpose: we only flag clearly automated patterns so we
// never block a real seller.

const DISPOSABLE_DOMAINS = new Set([
  'formlimited.com',
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'trashmail.com',
  'yopmail.com',
  'getnada.com',
  'sharklasers.com',
  'dispostable.com',
  'throwawaymail.com',
  'maildrop.cc',
  'fakeinbox.com',
  'mintemail.com',
  'mohmal.com',
  'mailnesia.com',
  'emailondeck.com',
]);

export const isDisposableEmail = (email) => {
  const domain = String(email || '')
    .split('@')[1]
    ?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
};

// Bot names look like a single long random token (e.g. "ixPksLWGiHjkxtxMSLLv").
export const looksLikeBotName = (name) => {
  const value = String(name || '').trim();
  if (!value) return true;
  const noSpaces = !value.includes(' ');
  return noSpaces && value.length >= 16;
};

// Bot emails use many tiny dot-separated segments (e.g. "k.ozl.o.w.j.e@gmail.com").
export const looksLikeBotEmail = (email) => {
  const local = String(email || '').split('@')[0] || '';
  const parts = local.split('.');
  if (parts.length < 4) return false;
  const average = local.replace(/\./g, '').length / parts.length;
  return average <= 3;
};

export const isLikelyBot = ({ fullname, email, website }) =>
  Boolean(website && String(website).trim() !== '') ||
  looksLikeBotName(fullname) ||
  looksLikeBotEmail(email) ||
  isDisposableEmail(email);
