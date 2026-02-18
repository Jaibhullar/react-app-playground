import pluginReact from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

const aliasPaths = ['/'];
const files = ['**/*.{js,ts,jsx,tsx,test.tsx}'];
const ignores = ['dist', 'node_modules'];

const importSortConfig = [
	[
		// `react` first, then packages starting with a character, then packages with an @ (except local alias ones)
		'^react$',
		'^[a-z]',
		`^@(?!(${aliasPaths.join('|')}))`,
	],
	[
		// local alias imports
		`^@(?:(${aliasPaths.join('|')}))`,
	],
	[
		// Imports starting with `./`, `../`, or `../..`
		'^\\.\\.(?!/?$)',
		'^\\.\\./?$',
		'^\\./(?=.*/)(?!/?$)',
		'^\\.(?!/?$)',
		'^\\./?$',
	],
	[
		// Style imports
		'^.+\\.s?css$',
	],
];

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files },
	{ ignores },
	{ languageOptions: { globals: { ...globals.browser, ...globals.vitest } } },
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
			'react-hooks': hooksPlugin,
			stylistic: stylistic,
		},
	},
	testingLibrary.configs['flat/react'],
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	pluginReact.configs.flat['jsx-runtime'],
	{
		rules: {
		/* General overrides */
			...hooksPlugin.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ ignoreRestSiblings: true },
			],
			'no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'react-hooks/exhaustive-deps': 'off', // This rule is too strict and should be manually checked instead
			/* Import sorting rules */
			'simple-import-sort/exports': 'warn',
			'simple-import-sort/imports': ['warn', { groups: importSortConfig }],
			/* Stylistic (formatting) rules */
			'stylistic/quotes': [
				'error',
				'single',
				{ allowTemplateLiterals: 'always' },
			],
			'stylistic/brace-style': ['warn', 'stroustrup'],
			'stylistic/spaced-comment': [
				'warn',
				'always',
				{ block: { balanced: true } },
			],
			'stylistic/indent': ['warn', 'tab', { ObjectExpression: 'first' }],
			'stylistic/no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
			'stylistic/no-multi-spaces': ['warn', { ignoreEOLComments: true }],
			'stylistic/comma-spacing': ['warn', { before: false, after: true }],
			'stylistic/comma-dangle': ['warn', {
				'arrays': 'always-multiline',
				'objects': 'always-multiline',
				'enums': 'always-multiline',
			}],
			'stylistic/object-curly-spacing': ['warn', 'always'],
			'stylistic/object-curly-newline': ['warn', {
				'ObjectExpression': { multiline: true, consistent: true },
				'ObjectPattern': { multiline: true, consistent: true },
				'TSTypeLiteral': 'always',
			}],
			'stylistic/key-spacing': ['warn'],
			'stylistic/semi': ['warn', 'always'],
			'stylistic/space-before-blocks': ['warn', 'always'],
			'stylistic/no-trailing-spaces': ['warn'],
			'stylistic/space-infix-ops': ['warn'],
			'stylistic/member-delimiter-style': ['warn', {
				'multiline': {
					'delimiter': 'comma',
					'requireLast': true,
				},
				'singleline': {
					'delimiter': 'comma',
					'requireLast': false,
				},
				'multilineDetection': 'brackets',
			}],
			/* Testing Library rules */
			'testing-library/no-wait-for-multiple-assertions': 'off',
			'testing-library/render-result-naming-convention': 'off',
		},
	},
	{ settings: { react: { version: 'detect' } } },
];
