import * as React from 'react'

interface BadgeProps {
  onClick?: () => void
  title?: string
  isActive?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
}

export default function Badge({ onClick, title, isActive, children, style }: BadgeProps) {
  return (
    <div
      className={`Badge_root ${isActive ? 'Badge_active' : ''}`}
      onClick={onClick}
      title={title}
      style={style}
    >
      {children}
    </div>
  )
}
``