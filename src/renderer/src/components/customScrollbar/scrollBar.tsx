// components/CustomScrollbar.tsx
import React, { useEffect, useRef } from 'react'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

interface CustomScrollbarProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const CustomScrollbar = ({ children, style, className }: CustomScrollbarProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ps = new PerfectScrollbar(containerRef.current!, {
      suppressScrollX: true // ini juga bantu mencegah horizontal scroll
    })

    return () => {
      ps.destroy()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflowX: 'hidden', ...style }}
      className={className}
    >
      {children}
    </div>
  )
}
