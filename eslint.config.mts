import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
    type: 'lib',
    ignores: [
      '**/lib/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/*.tsbuildinfo',
      '**/coverage/**',
      '**/scripts/pack-smoke/**',
      '**/temp/**',
    ],
    typescript: {
      tsconfigPath: 'tsconfig.json',
      filesTypeAware: ['src/**/*.{ts,tsx}'],
      overrides: {
        'ts/no-require-imports': 'off',
      },
      overridesTypeAware: {
        'ts/no-redundant-type-constituents': 'off',
        'ts/require-await': 'off',
        'ts/strict-boolean-expressions': 'off',
      },
    },
  },
  {
    files: [
      'test/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
    ],
    rules: {
      'antfu/no-top-level-await': 'off',
      'curly': ['error', 'all'],
      'no-undef': 'off',
      'test/consistent-test-it': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
)
