import { authService } from './auth.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';
import { generateJWT } from '../../config/plugins/generate-jwt.js';
import { comparePassword } from '../../config/plugins/encrypted-password.js';
import { r2Storage } from '../../config/r2/r2.js';
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} from './auth.schema.js';
import crypto from 'crypto';

export const register = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateRegister(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const existingEmail = await authService.findOneByEmail(data.email);
  if (existingEmail) {
    return next(new AppError('El email ya está registrado', 400));
  }

  const existingUsername = await authService.findOneByUsername(data.username);
  if (existingUsername) {
    return next(new AppError('El nombre de usuario ya está en uso', 400));
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await authService.create({
    ...data,
    emailVerificationToken: verificationToken,
  });

  const token = generateJWT({ id: user.id, role: user.role });

  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
      storeName: user.storeName,
      rank: user.rank,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateLogin(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const user = await authService.findOneByEmail(data.email);
  if (!user) {
    return next(new AppError('El email o la contraseña son incorrectos', 401));
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    return next(new AppError('El email o la contraseña son incorrectos', 401));
  }

  const token = generateJWT({ id: user.id, role: user.role });

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
      storeName: user.storeName,
      rank: user.rank,
      emailVerified: user.emailVerified,
    },
  });
});

export const getProfile = catchAsync(async (req, res) => {
  const user = req.sessionUser;
  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
      storeName: user.storeName,
      description: user.description,
      avatarUrl: user.avatarUrl,
      rank: user.rank,
      isDiamante: user.rank === 'diamante',
      emailVerified: user.emailVerified,
      isVerified: user.isVerified,
      isTopSeller: user.isTopSeller,
      mpConnected: user.mpConnected,
    },
  });
});

export const getPublicProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Validate UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return next(new AppError('ID de usuario inválido.', 400));
  }

  const user = await authService.findOneById(id);
  if (!user || user.isDeleted) {
    return next(new AppError('Usuario no encontrado.', 404));
  }

  // Only return public info
  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      username: user.username,
      storeName: user.storeName,
      description: user.description,
      avatarUrl: user.avatarUrl,
      rank: user.rank,
      isVerified: user.isVerified,
      isTopSeller: user.isTopSeller,
      createdAt: user.createdAt,
    },
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateUpdateProfile(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  if (data.username) {
    const existing = await authService.findOneByUsername(data.username);
    if (existing && existing.id !== req.sessionUser.id) {
      return next(new AppError('El nombre de usuario ya está en uso', 400));
    }
  }

  const user = await authService.update(req.sessionUser.id, data);

  res.status(200).json({
    status: 'success',
    user: {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
      storeName: user.storeName,
      description: user.description,
      avatarUrl: user.avatarUrl,
      rank: user.rank,
    },
  });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, data } = validateChangePassword(req.body);
  if (hasError) {
    return res.status(422).json({ status: 'error', message: errorMessages.join(', ') });
  }

  const user = await authService.findOneByEmail(req.sessionUser.email);
  const isPasswordValid = await comparePassword(data.currentPassword, user.password);
  if (!isPasswordValid) {
    return next(new AppError('La contraseña actual es incorrecta', 401));
  }

  await authService.update(user.id, {
    password: data.newPassword,
    changedPasswordAt: new Date(),
  });

  res.status(200).json({
    status: 'success',
    message: 'Contraseña actualizada correctamente',
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const user = await authService.findByVerificationToken(token);
  if (!user) {
    return next(new AppError('Token de verificación inválido', 400));
  }

  await authService.update(user.id, {
    emailVerified: true,
    emailVerificationToken: null,
  });

  res.status(200).json({
    status: 'success',
    message: 'Email verificado correctamente',
  });
});

export const activateSeller = catchAsync(async (req, res, next) => {
  const { storeName, description } = req.body;

  if (!storeName || storeName.trim().length < 2) {
    return next(new AppError('El nombre de la tienda es requerido (mínimo 2 caracteres)', 422));
  }

  const user = req.sessionUser;

  if (user.role === 'seller') {
    return next(new AppError('Ya tenés una cuenta de vendedor activa.', 400));
  }

  const updated = await authService.update(user.id, {
    role: 'seller',
    storeName: storeName.trim(),
    description: description?.trim() || '',
  });

  res.status(200).json({
    status: 'success',
    message: '¡Cuenta de vendedor activada correctamente!',
    user: {
      id: updated.id,
      fullname: updated.fullname,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      storeName: updated.storeName,
      description: updated.description,
      rank: updated.rank,
    },
  });
});

export const uploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No se seleccionó ninguna imagen.', 400));
  }

  // Upload to R2
  const result = await r2Storage.uploadFile(
    req.file.buffer,
    `avatar-${Date.now()}-${req.file.originalname}`,
    req.file.mimetype
  );

  // Update user avatar URL
  const updated = await authService.update(req.sessionUser.id, {
    avatarUrl: result.url,
  });

  res.status(200).json({
    status: 'success',
    message: 'Foto de perfil actualizada correctamente',
    avatarUrl: updated.avatarUrl,
  });
});
