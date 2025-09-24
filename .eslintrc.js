module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    globals: {
        'SwiftGamificationApp': 'readonly',
        'DashboardComponent': 'readonly',
        'RankingComponent': 'readonly',
        'ApiService': 'readonly',
        'swiftApp': 'writable',
        'apiService': 'readonly'
    },
    rules: {
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'never'],
        'no-trailing-spaces': 'error',
        'eol-last': 'error',
        
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-alert': 'warn',
        'no-unused-vars': 'error',
        'no-undef': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
        
        'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
        'prefer-arrow-callback': 'error',
        'arrow-spacing': 'error',
        'arrow-parens': ['error', 'as-needed'],
        
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
        
        'spaced-comment': ['error', 'always'],
        'multiline-comment-style': ['error', 'starred-block'],
        
        'max-len': ['warn', { 'code': 120, 'ignoreUrls': true }],
        'max-params': ['warn', 4],
        'complexity': ['warn', 10],
        'max-nested-callbacks': ['error', 3],
        
        'prefer-promise-reject-errors': 'error',
        'no-return-await': 'error',
        
        'class-methods-use-this': 'warn',
        'no-duplicate-class-members': 'error',
        
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error'
    },
    overrides: [
        {

            files: ['**/*.test.js', '**/*.spec.js'],
            env: {
                jest: true
            },
            rules: {
                'no-console': 'off'
            }
        },
        {

            files: ['src/assets/js/components/*.js'],
            rules: {
                'class-methods-use-this': 'off',
                'no-console': 'off'
            }
        },
        {

            files: ['src/assets/js/utils/*.js'],
            rules: {
                'max-params': ['warn', 6]
            }
        }
    ]
};
