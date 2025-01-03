import * as React from 'react'

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

const Text: React.FC<TextProps> = ({ children, ...rest }) => {
  return (
    <p className="Text_root" {...rest}>
      {children}
    </p>
  )
}

export default Text
