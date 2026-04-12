#!/bin/bash
# Clear stale Next.js dev server lock file and .next cache
rm -f /vercel/share/v0-project/.next/dev/lock
rm -rf /vercel/share/v0-project/.next
echo "Cleared Next.js lock and cache"
