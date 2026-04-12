'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface MenuStickerProps {
  src: string
  alt: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
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
  hideMobile = true,
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
    'top-right': 'top-4 right-4 md:top-8 md:right-8',
    'bottom-left': 'bottom-4 left-4 md:bottom-8 md:left-8',
    'bottom-right': 'bottom-4 right-4 md:bottom-8 md:right-8',
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
