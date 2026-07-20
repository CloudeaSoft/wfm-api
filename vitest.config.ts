import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      exclude: ['lib', 'test'],
      clean: true,
      cleanOnRerun: true,
      reportsDirectory: './coverage',
    },
  },
})
