'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface MenuStickerProps {
  src: string
  alt: string
  position: 'top-left' | 'top-center' | 'top-right' | 'top-left-offset' | 'top-right-offset' | 'middle-left' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'bottom-left-offset' | 'bottom-right-offset'
  size?: 'sm' | 'md' | 'lg'
  opacity?: number
  animate?: boolean
  hideMobile?: boolean
}

export function MenuSticker({
  src,
  alt,
  position,
  size = 'md',
  opacity = 0.08,
  animate = true,
  hideMobile = false,
}: MenuStickerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 160,
  }

  const positionMap = {
    'top-left': 'top-4 left-4 md:top-8 md:left-8',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 md:top-8',
    'top-right': 'top-4 right-4 md:top-8 md:right-8',
    'top-left-offset': 'top-24 left-2 md:top-32 md:left-12',
    'top-right-offset': 'top-24 right-2 md:top-32 md:right-12',
    'middle-left': 'top-1/2 -translate-y-1/2 left-2 md:left-8',
    'middle-right': 'top-1/2 -translate-y-1/2 right-2 md:right-8',
    'bottom-left': 'bottom-4 left-4 md:bottom-8 md:left-8',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 md:bottom-8',
    'bottom-right': 'bottom-4 right-4 md:bottom-8 md:right-8',
    'bottom-left-offset': 'bottom-24 left-2 md:bottom-32 md:left-12',
    'bottom-right-offset': 'bottom-24 right-2 md:bottom-32 md:right-12',
  }

  const dimension = sizeMap[size]

  return (
    <div
      className={`absolute ${positionMap[position]} ${hideMobile ? 'hidden md:block' : 'block'} transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'} ${animate ? 'animate-float' : ''}`}
      style={{ pointerEvents: 'none', opacity: isVisible ? opacity : 0 }}
      aria-hidden="true"
      role="presentation"
    >
      <Image
        src={src}
        alt={alt}
        width={dimension}
        height={dimension}
        className="w-full h-auto"
        unoptimized
      />
    </div>
  )
}
