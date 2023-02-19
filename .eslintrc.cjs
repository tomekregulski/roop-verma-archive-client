module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb', // overwrites eslint recommended, so we deleted that
        'airbnb/typescript',
        'airbnb/hooks',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // important that this is the last item in the array to avoid conflict with other rules
    ],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: '/tsconfig.json',
    },
    plugins: ['react', '@typescript-eslint', 'prettier'],
    rules: {
        // 'prese'
    },
};
