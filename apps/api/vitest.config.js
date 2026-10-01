import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 15000,
    // Run test files sequentially to avoid email/username collisions between
    // files that register users using Date.now() as suffix.
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
    },
  },
});
