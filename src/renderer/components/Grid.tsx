import * as React from 'react'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const Grid: React.FC<GridProps> = ({ children, ...rest }) => {
  return (
    <div className="Grid_root" {...rest}>
      {children}
    </div>
  )
}

export default Grid
