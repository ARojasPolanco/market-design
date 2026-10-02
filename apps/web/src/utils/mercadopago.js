import api from '../config/api.js';

export async function connectMercadoPago() {
  const res = await api.get('/v1/mp/connect');
  if (res.data?.authUrl) {
    window.location.href = res.data.authUrl;
  }
}
