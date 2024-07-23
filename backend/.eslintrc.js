module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'hexagonal-architecture'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['node_modules', '.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'CallExpression[callee.object.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true])), CallExpression[callee.object.property.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true]))',
        message:
          'Add "{ infer: true }" to configService.get() for correct typechecking. Example: configService.get("database.port", { infer: true })',
      },
      {
        selector: 'CallExpression[callee.name=it][arguments.0.value!=/^should/]',
        message: '"it" should start with "should"',
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
    'no-unused-expressions': [
      'error',
      {
        allowTernary: true,
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'no-param-reassign': 'error',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  overrides: [
    {
      files: ['src/**/*.ts'],
      excludedFiles: ['src/main.ts', 'src/environments.ts', 'src/database/**/*.ts', '**/*.spec.ts', 'src/tests/**/*.ts'],
      rules: {
        'hexagonal-architecture/enforce': ['error'],
      },
    },
  ],
};
