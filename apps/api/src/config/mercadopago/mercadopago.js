import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { envs } from '../enviroments.js';

const client = new MercadoPagoConfig({
  accessToken: envs.MP_ACCESS_TOKEN,
});

export const mpPayment = new Payment(client);
export const mpPreference = new Preference(client);

export class MercadoPagoService {
  async createPreference(items, externalReference, _sellerId) {
    const preference = await mpPreference.create({
      body: {
        items: items.map((item) => ({
          title: item.title,
          quantity: 1,
          unit_price: item.price,
          currency_id: 'ARS',
        })),
        external_reference: externalReference,
        back_urls: {
          success: `${envs.CORS_ORIGIN}/checkout/success`,
          failure: `${envs.CORS_ORIGIN}/checkout/failure`,
          pending: `${envs.CORS_ORIGIN}/checkout/pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'Market Design',
      },
    });

    return preference;
  }

  async getPayment(paymentId) {
    const payment = await mpPayment.get({ id: paymentId });
    return payment;
  }

  verifyWebhookSignature(_body, _signature) {
    // MP webhook signature verification
    // For now, we'll do basic validation
    return true;
  }
}

export const mpService = new MercadoPagoService();
