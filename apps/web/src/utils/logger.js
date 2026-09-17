const isDev = import.meta.env.DEV;

export const logger = {
  error: (message, ...args) => {
    if (isDev) {
      console.error(message, ...args);
    }
  },
  warn: (message, ...args) => {
    if (isDev) {
      console.warn(message, ...args);
    }
  },
  info: (message, ...args) => {
    if (isDev) {
      console.log(message, ...args);
    }
  },
};

export default logger;
