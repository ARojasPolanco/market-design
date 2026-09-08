import { AppError } from './appError.js';

const handleSequelizeUniqueConstraint = (err) => {
  const field = err.errors?.[0]?.path || 'field';
  return new AppError(`The value for '${field}' already exists.`, 400);
};

const handleSequelizeValidationError = (err) => {
  const messages = err.errors.map((e) => e.message).join('. ');
  return new AppError(`Validation error: ${messages}`, 400);
};

const handleJwtExpired = () => new AppError('Your token has expired. Please log in again.', 401);
const handleJwtInvalid = () => new AppError('Invalid token. Please log in again.', 401);

const handlePgUniqueViolation = (err) => {
  const detail = err.detail || '';
  const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
  const field = match ? match[1] : 'field';
  return new AppError(`The value for '${field}' already exists.`, 400);
};

const handlePgForeignKeyViolation = () => new AppError('Referenced record does not exist.', 400);

const handlePgValueTooLong = () =>
  new AppError('One or more values exceed the allowed length.', 400);

const handlePgInvalidType = () => new AppError('Invalid data type provided.', 400);

const handleMulterFileSize = () => new AppError('File size exceeds the maximum allowed.', 400);

const handleMulterUnexpectedFile = () => new AppError('Unexpected file field.', 400);

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
