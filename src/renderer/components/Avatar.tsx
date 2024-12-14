
import * as React from 'react'

interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'className' | 'children'> {
  src?: string
  href?: string
  target?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const { src, style: propStyle, href, target, children, ...rest } = props

  const backgroundStyle = src ? { backgroundImage: `url(${src})` } : {}

  const combinedStyle = { ...propStyle, ...backgroundStyle }

  let avatarElement: React.ReactElement<any>

  if (href) {
    avatarElement = (
      <a
        className="Avatar_root"
        style={combinedStyle}
        href={href}
        target={target}
        tabIndex={0}
        role="link"
      />
    )
  } else {
    avatarElement = <figure className="Avatar_root" style={combinedStyle} />
  }

  if (!children) {
    return avatarElement
  }

  return (
    <div className="Avatar_parent" {...rest}>
      {avatarElement}
      <span className="Avatar_right">{children}</span>
    </div>
  )
}

export default Avatar
