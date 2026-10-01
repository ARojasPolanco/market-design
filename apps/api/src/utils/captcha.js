import { envs } from '../config/enviroments.js';

const HCAPTCHA_VERIFY_URL = 'https://api.hcaptcha.com/siteverify';

// Verifies an hCaptcha token. Skipped in tests or when no secret is configured
// (so local dev without captcha keys keeps working).
export async function verifyCaptcha(token) {
  if (envs.NODE_ENV === 'test') return true;
  if (!envs.HCAPTCHA_SECRET) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({
      secret: envs.HCAPTCHA_SECRET,
      response: token,
    });
    const res = await fetch(HCAPTCHA_VERIFY_URL, { method: 'POST', body });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}
