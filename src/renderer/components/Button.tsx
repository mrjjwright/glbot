import * as React from 'react'
import * as Utilities from 'src/renderer/common/utilities'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: 'PRIMARY' | 'SECONDARY'
  isDisabled?: boolean
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ theme = 'PRIMARY', isDisabled, children, ...rest }) => {
  let classNames = Utilities.classNames("Button_root", "Button_primary")

  if (theme === 'SECONDARY') {
    classNames = Utilities.classNames("Button_root", "Button_secondary")
  }

  if (isDisabled) {
    classNames = Utilities.classNames("Button_root", "Button_disabled")

    return <div className={classNames}>{children}</div>
  }

  return (
    <button className={classNames} role="button" tabIndex={0} disabled={isDisabled} {...rest}>
      {children}
    </button>
  )
}

export default Button
