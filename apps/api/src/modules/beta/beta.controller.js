import { betaService } from './beta.service.js';
import { validateCreateBetaSignup } from './beta.schema.js';
import { isLikelyBot } from './beta.utils.js';
import { BETA_SLOTS, getBetaSlot } from '../../config/beta.js';
import { mailService } from '../../config/resend/resend.js';
import { envs } from '../../config/enviroments.js';
import { AppError } from '../../errors/appError.js';
import { catchAsync } from '../../errors/catchAsync.js';

const sendBetaMail = async (to, fullname, slot) => {
  if (envs.NODE_ENV === 'test') return;
  try {
    const result = slot
      ? await mailService.sendBetaConfirmation(to, { fullname, slot })
      : await mailService.sendBetaReceived(to, { fullname });
    if (result?.error) {
      console.error('Resend beta email error:', result.error);
    }
  } catch (error) {
    console.error('Error sending beta email:', error);
  }
};

export const getSlots = catchAsync(async (_req, res) => {
  const slots = await Promise.all(
    BETA_SLOTS.filter((slot) => !slot.closed).map(async (slot) => {
      const taken = await betaService.countBySlot(slot.key);
      const remaining = Math.max(slot.capacity - taken, 0);
      return {
        key: slot.key,
        label: slot.label,
        shortLabel: slot.shortLabel,
        capacity: slot.capacity,
        remaining,
        full: remaining === 0,
      };
    })
  );

  res.status(200).json({ status: 'success', slots });
});

export const createSignup = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateCreateBetaSignup(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const slot = data.slotKey ? getBetaSlot(data.slotKey) : null;
  if (data.slotKey && !slot) {
    return next(new AppError('La fecha elegida no es válida.', 422));
  }
  if (slot && slot.closed) {
    return next(new AppError('Esa fecha ya no está disponible. Elegí otra, por favor.', 422));
  }

  const email = data.email.toLowerCase();

  // Anti-bot: pretend success (so bots don't retry) but never store the signup.
  if (isLikelyBot({ fullname: data.fullname, email, website: data.website })) {
    return res.status(201).json({
      status: 'success',
      message: '¡Listo! Recibimos tus datos.',
    });
  }

  // If a slot was chosen, enforce its capacity.
  if (slot) {
    const taken = await betaService.countBySlot(slot.key);
    if (taken >= slot.capacity) {
      return next(new AppError('Esa fecha ya está completa. Elegí otra, por favor.', 422));
    }
  }

  const payload = {
    fullname: data.fullname,
    whatsapp: data.whatsapp,
    slotKey: slot ? slot.key : null,
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
  };
  const slotInfo = slot ? { key: slot.key, label: slot.label } : null;

  const existing = await betaService.findByEmail(email);
  if (existing) {
    await existing.update(payload);
    await sendBetaMail(email, data.fullname, slot);
    return res.status(200).json({
      status: 'success',
      message: '¡Listo! Actualizamos tus datos.',
      slot: slotInfo,
    });
  }

  await betaService.create({ email, ...payload });
  await sendBetaMail(email, data.fullname, slot);

  res.status(201).json({
    status: 'success',
    message: '¡Listo! Recibimos tus datos.',
    slot: slotInfo,
  });
});

export const getBetaSignups = catchAsync(async (_req, res) => {
  const signups = await betaService.findAll();

  const slots = BETA_SLOTS.map((slot) => ({
    key: slot.key,
    label: slot.label,
    shortLabel: slot.shortLabel,
    capacity: slot.capacity,
    closed: Boolean(slot.closed),
    count: signups.filter((signup) => signup.slotKey === slot.key).length,
  }));

  const unassigned = signups.filter((signup) => !signup.slotKey).length;

  res.status(200).json({ status: 'success', signups, slots, unassigned });
});
