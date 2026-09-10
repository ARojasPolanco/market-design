import { AppError } from '../../errors/appError.js';
import { verifyJWT } from '../../config/plugins/generate-jwt.js';
import { authService } from './auth.service.js';

export const protect = async (req, _res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('No estás logueado. Iniciá sesión para continuar.', 401));
    }

    const decoded = verifyJWT(token);

    const user = await authService.findOneById(decoded.id);
    if (!user) {
      return next(new AppError('El usuario de este token ya no existe.', 401));
    }

    if (user.changedPasswordAt) {
      const changedTimestamp = parseInt(user.changedPasswordAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return next(new AppError('La contraseña fue cambiada recientemente. Iniciá sesión de nuevo.', 401));
      }
    }

    req.sessionUser = user;
    next();
  } catch (_error) {
    return next(new AppError('Token inválido o expirado.', 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(new AppError('No tenés permiso para realizar esta acción.', 403));
    }
    next();
  };
};

export const protectAccountOwner = (req, _res, next) => {
  const { sessionUser, params } = req;
  if (sessionUser.id !== params.id && sessionUser.role !== 'admin') {
    return next(new AppError('No tenés permiso para realizar esta acción.', 403));
  }
  next();
};
