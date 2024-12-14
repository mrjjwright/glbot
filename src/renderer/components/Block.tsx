
import * as React from 'react'

interface BlockProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

const Block: React.FC<BlockProps> = ({ children, ...rest }) => {
  return (
    <span className="Block_block" {...rest}>
      {children}
    </span>
  )
}

export default Block
