
import * as React from 'react'

interface IndentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Indent: React.FC<IndentProps> = ({ children, ...rest }) => {
  return (
    <div className="Indent_root" {...rest}>
      {children}
    </div>
  )
}

export default Indent
