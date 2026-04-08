#!/usr/bin/env node

import { rm } from 'fs/promises'
import { join } from 'path'

async function cleanCache() {
  try {
    const nextDir = join(process.cwd(), '.next')
    console.log('[CLEAN] Removing .next directory:', nextDir)
    await rm(nextDir, { recursive: true, force: true })
    console.log('[CLEAN] ✓ Cache cleaned successfully')
  } catch (error) {
    console.error('[CLEAN] Error:', error)
    process.exit(1)
  }
}

cleanCache()
