import { join } from 'path'
import { fileURLToPath } from 'url'

export const ROOT = join(fileURLToPath(import.meta.url), '..', '..', '..')
export const PROJECTS = join(ROOT, '..')
export const DIST = join(ROOT, 'dist')
export const SRC = join(ROOT, 'src')
