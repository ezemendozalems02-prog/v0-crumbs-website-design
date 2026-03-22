'use server'

import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

export async function uploadProductImage(formData: FormData) {
  try {
    const file = formData.get('file') as File
    
    if (!file) {
      return { error: 'No file provided' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { error: 'Only image files are allowed' }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'File size must be less than 5MB' }
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `productos/${uuidv4()}.${ext}`

    // Upload to Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    return { url: blob.url, success: true }
  } catch (error) {
    console.error('Blob upload error:', error)
    return { error: 'Failed to upload image' }
  }
}
