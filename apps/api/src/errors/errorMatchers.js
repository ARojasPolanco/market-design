import { AppError } from './appError.js';

const handleSequelizeUniqueConstraint = (err) => {
  const field = err.errors?.[0]?.path || 'campo';
  return new AppError(`El valor para '${field}' ya existe.`, 400);
};

const handleSequelizeValidationError = (err) => {
  const messages = err.errors.map((e) => e.message).join('. ');
  return new AppError(`Error de validación: ${messages}`, 400);
};

const handleJwtExpired = () => new AppError('Tu sesión ha expirado. Por favor, iniciá sesión de nuevo.', 401);
const handleJwtInvalid = () => new AppError('Token inválido. Por favor, iniciá sesión de nuevo.', 401);

const handlePgUniqueViolation = (err) => {
  const detail = err.detail || '';
  const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
  const field = match ? match[1] : 'campo';
  return new AppError(`El valor para '${field}' ya existe.`, 400);
};

const handlePgForeignKeyViolation = () => new AppError('El registro referenciado no existe.', 400);

const handlePgValueTooLong = () =>
  new AppError('Uno o más valores exceden la longitud permitida.', 400);

const handlePgInvalidType = () => new AppError('Tipo de dato inválido.', 400);

const handleMulterFileSize = () => new AppError('El archivo excede el tamaño máximo permitido.', 400);

const handleMulterUnexpectedFile = () => new AppError('Campo de archivo inesperado.', 400);

export const errorMatchers = [
  {
    match: (err) => err.name === 'SequelizeUniqueConstraintError',
    transform: handleSequelizeUniqueConstraint,
  },
  {
    match: (err) => err.name === 'SequelizeValidationError',
    transform: handleSequelizeValidationError,
  },
  { match: (err) => err.name === 'TokenExpiredError', transform: handleJwtExpired },
  { match: (err) => err.name === 'JsonWebTokenError', transform: handleJwtInvalid },
  { match: (err) => err.code === '23505', transform: handlePgUniqueViolation },
  { match: (err) => err.code === '23503', transform: handlePgForeignKeyViolation },
  { match: (err) => err.code === '22001', transform: handlePgValueTooLong },
  { match: (err) => err.code === '22P02', transform: handlePgInvalidType },
  { match: (err) => err.code === 'LIMIT_FILE_SIZE', transform: handleMulterFileSize },
  { match: (err) => err.code === 'LIMIT_UNEXPECTED_FILE', transform: handleMulterUnexpectedFile },
];

export const matchError = (err) => {
  for (const matcher of errorMatchers) {
    if (matcher.match(err)) {
      return matcher.transform(err);
    }
  }
  return null;
};
