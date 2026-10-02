import crypto from 'node:crypto';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { envs, appUrl } from '../enviroments.js';

const MP_API = 'https://api.mercadopago.com';
const MP_AUTH = 'https://auth.mercadopago.com/authorization';

const platformClient = new MercadoPagoConfig({
  accessToken: envs.MP_ACCESS_TOKEN,
});

export const mpPayment = new Payment(platformClient);

export class MercadoPagoService {
  isConfigured() {
    return Boolean(envs.MP_CLIENT_ID && envs.MP_CLIENT_SECRET);
  }

  getRedirectUri() {
    return `${envs.API_PUBLIC_URL}/api/v1/mp/callback`;
  }

  getWebhookUrl() {
    return `${envs.API_PUBLIC_URL}/api/v1/purchases/webhook`;
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: envs.MP_CLIENT_ID,
      response_type: 'code',
      platform_id: 'mp',
      state,
      redirect_uri: this.getRedirectUri(),
    });
    return `${MP_AUTH}?${params.toString()}`;
  }

  async exchangeCode(code) {
    const res = await fetch(`${MP_API}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: envs.MP_CLIENT_ID,
        client_secret: envs.MP_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.getRedirectUri(),
      }),
    });
    if (!res.ok) {
      throw new Error(`MP OAuth token error ${res.status}: ${await res.text()}`);
    }
    return await res.json();
  }

  async refreshAccessToken(refreshToken) {
    const res = await fetch(`${MP_API}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: envs.MP_CLIENT_ID,
        client_secret: envs.MP_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    if (!res.ok) {
      throw new Error(`MP refresh token error ${res.status}: ${await res.text()}`);
    }
    return await res.json();
  }

  async createSellerPreference(sellerAccessToken, { items, externalReference, marketplaceFee }) {
    const client = new MercadoPagoConfig({ accessToken: sellerAccessToken });
    const preference = new Preference(client);

    return await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.title,
          quantity: 1,
          unit_price: Number(item.price),
          currency_id: 'ARS',
        })),
        external_reference: externalReference,
        marketplace_fee: Number(marketplaceFee),
        notification_url: this.getWebhookUrl(),
        back_urls: {
          success: `${appUrl}/checkout/success`,
          failure: `${appUrl}/checkout/failure`,
          pending: `${appUrl}/checkout/pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'Market Design',
      },
    });
  }

  async getPayment(paymentId, sellerAccessToken) {
    const client = sellerAccessToken
      ? new MercadoPagoConfig({ accessToken: sellerAccessToken })
      : platformClient;
    return await new Payment(client).get({ id: paymentId });
  }

  verifyWebhookSignature({ dataId, signature, requestId }) {
    const secret = envs.MP_WEBHOOK_SECRET;

    if (!secret) {
      return envs.NODE_ENV !== 'production';
    }
    if (!signature || !requestId || !dataId) return false;

    const parts = Object.fromEntries(
      signature.split(',').map((part) => {
        const [k, v] = part.split('=');
        return [k.trim(), (v || '').trim()];
      })
    );

    const { ts, v1 } = parts;
    if (!ts || !v1) return false;

    const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${ts};`;
    const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

    try {
      return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
    } catch {
      return false;
    }
  }
}

export const mpService = new MercadoPagoService();
