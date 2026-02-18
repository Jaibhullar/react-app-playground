
export default {
	plugins: ['stylelint-scss'],
	ignoreFiles: [
		'node_modules/**/*',
	],
	overrides: [
		{
			files: [
				'**/*.scss',
				'**/*.css',
			],
		},
	],
	extends: [
		'stylelint-config-standard-scss',
		'stylelint-config-css-modules',
	],
	rules: {
		'selector-class-pattern': [
			'^(--)?([a-z_][a-z0-9_]*)(--?[a-z0-9_]+)*$',
			{
				'message': 'Expected class selector to be kebab-case (BEM prefix allowed)',
			},
		],
		'at-rule-no-unknown': null, // Disable in favour of scss version
		'declaration-block-no-redundant-longhand-properties': null,
		'no-descending-specificity': [
			true,
			{
				severity: 'warning',
			},
		],
		'color-hex-length': null, // Want to switch to CSS vars anyway
		'scss/double-slash-comment-whitespace-inside': ['always', { severity: 'warning' }],
		'scss/double-slash-comment-empty-line-before': [
			'always',
			{
				ignore: 'between-comments',
				severity: 'warning',
			},
		],
		'scss/dollar-variable-empty-line-before': null,
	},
};