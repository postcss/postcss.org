import loguxConfig from '@logux/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [{ ignores: ['dist/', 'design/'] }, ...loguxConfig]
