import jwt from 'jsonwebtoken';
import { mpService } from '../../config/mercadopago/mercadopago.js';
import { authService } from '../auth/auth.service.js';
import { envs, appUrl } from '../../config/enviroments.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';

export const getConnectUrl = catchAsync(async (req, res, next) => {
  if (!mpService.isConfigured()) {
    return next(new AppError('Mercado Pago no está configurado.', 503));
  }

  const state = jwt.sign(
    { id: req.sessionUser.id, purpose: 'mp_oauth' },
    envs.SECRET_JWT_SEED,
    { expiresIn: '15m' }
  );

  res.status(200).json({
    status: 'success',
    authUrl: mpService.getAuthorizationUrl(state),
  });
});

export const handleCallback = catchAsync(async (req, res) => {
  const { code, state, error } = req.query;
  const redirectFail = `${appUrl}/vendedor/panel?mp=error`;

  if (error || !code || !state) {
    return res.redirect(redirectFail);
  }

  let payload;
  try {
    payload = jwt.verify(state, envs.SECRET_JWT_SEED);
  } catch {
    return res.redirect(redirectFail);
  }

  if (payload.purpose !== 'mp_oauth') {
    return res.redirect(redirectFail);
  }

  try {
    const tokens = await mpService.exchangeCode(code);
    await authService.update(payload.id, {
      mpAccessToken: tokens.access_token,
      mpRefreshToken: tokens.refresh_token || null,
      mpUserId: tokens.user_id ? String(tokens.user_id) : null,
      mpConnected: true,
    });
    return res.redirect(`${appUrl}/vendedor/panel?mp=connected`);
  } catch (_tokenError) {
    return res.redirect(redirectFail);
  }
});
