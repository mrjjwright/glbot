import * as React from 'react'
import * as Utilities from 'src/renderer/common/utilities'

interface ActionButtonProps {
  onClick?: () => void
  hotkey?: any
  children?: React.ReactNode
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, hotkey, children }) => {
  return (
    <div className="ActionButton_root" onClick={onClick} tabIndex={0} role="button">
      {Utilities.isEmpty(hotkey) ? null : <span className="ActionButton_hotkey">{hotkey}</span>}
      <span className="ActionButton_content">{children}</span>
    </div>
  )
}

export default ActionButton
