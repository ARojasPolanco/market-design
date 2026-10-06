import { betaService } from './beta.service.js';
import { validateCreateBetaSignup } from './beta.schema.js';
import { BETA_SLOTS, getBetaSlot } from '../../config/beta.js';
import { mailService } from '../../config/resend/resend.js';
import { envs } from '../../config/enviroments.js';
import { AppError } from '../../errors/appError.js';
import { catchAsync } from '../../errors/catchAsync.js';

const sendBetaMail = async (to, fullname, slot) => {
  if (envs.NODE_ENV === 'test') return;
  try {
    const result = await mailService.sendBetaConfirmation(to, { fullname, slot });
    if (result?.error) {
      console.error('Resend beta confirmation error:', result.error);
    }
  } catch (error) {
    console.error('Error sending beta confirmation email:', error);
  }
};

export const getSlots = catchAsync(async (_req, res) => {
  const slots = await Promise.all(
    BETA_SLOTS.map(async (slot) => {
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

  const slot = getBetaSlot(data.slotKey);
  if (!slot) {
    return next(new AppError('La fecha elegida no es válida.', 422));
  }

  const email = data.email.toLowerCase();
  const existing = await betaService.findByEmail(email);
  const taken = await betaService.countBySlot(slot.key);
  const isFull = taken >= slot.capacity;
  const slotInfo = { key: slot.key, label: slot.label };

  if (existing) {
    if (existing.slotKey === slot.key) {
      return res.status(200).json({
        status: 'success',
        message: 'Ya estabas anotado en esa fecha. ¡Nos vemos en la reunión!',
        slot: slotInfo,
      });
    }

    if (isFull) {
      return next(new AppError('Esa fecha ya está completa. Elegí otra, por favor.', 422));
    }

    await existing.update({
      fullname: data.fullname,
      whatsapp: data.whatsapp,
      slotKey: slot.key,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
    });
    await sendBetaMail(email, data.fullname, slot);

    return res.status(200).json({
      status: 'success',
      message: '¡Listo! Actualizamos tu fecha y te enviamos la confirmación.',
      slot: slotInfo,
    });
  }

  if (isFull) {
    return next(new AppError('Esa fecha ya está completa. Elegí otra, por favor.', 422));
  }

  await betaService.create({
    fullname: data.fullname,
    email,
    whatsapp: data.whatsapp,
    slotKey: slot.key,
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
  });
  await sendBetaMail(email, data.fullname, slot);

  res.status(201).json({
    status: 'success',
    message: '¡Listo! Te enviamos la confirmación por email.',
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
    count: signups.filter((signup) => signup.slotKey === slot.key).length,
  }));

  res.status(200).json({ status: 'success', signups, slots });
});
