import fs from 'fs'
import path from 'path'

const lockPath = path.join(process.cwd(), '.next', 'dev', 'lock')
const nextPath = path.join(process.cwd(), '.next')

// Remove lock file
try {
  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath)
    console.log('[v0] Removed lock file at:', lockPath)
  }
} catch (err) {
  console.log('[v0] Lock file not found or already cleared')
}

// Remove .next cache
try {
  if (fs.existsSync(nextPath)) {
    fs.rmSync(nextPath, { recursive: true, force: true })
    console.log('[v0] Cleared .next cache directory')
  }
} catch (err) {
  console.log('[v0] .next directory already cleared or error:', err.message)
}

console.log('[v0] Cache cleared. Dev server can now restart.')
