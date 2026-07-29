import loguxConfig from '@logux/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['dist/', 'design/', 'projects/'] },
  ...loguxConfig,
  {
    rules: {
      'n/no-unsupported-features/node-builtins': 'off'
    }
  }
]
