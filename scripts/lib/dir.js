import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(fileURLToPath(import.meta.url), '..', '..', '..')
export const PROJECTS = join(ROOT, '..')
export const DIST = join(ROOT, 'dist')
export const SRC = join(ROOT, 'src')
