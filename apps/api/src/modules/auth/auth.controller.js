import { authService } from './auth.service.js';
import { catchAsync } from '../../errors/catchAsync.js';
import { AppError } from '../../errors/appError.js';
import { generateJWT } from '../../config/plugins/generate-jwt.js';
import { comparePassword } from '../../config/plugins/encrypted-password.js';
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
    return next(new AppError('Credenciales inválidas', 401));
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    return next(new AppError('Credenciales inválidas', 401));
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
      emailVerified: user.emailVerified,
      isVerified: user.isVerified,
      isTopSeller: user.isTopSeller,
      mpConnected: user.mpConnected,
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
