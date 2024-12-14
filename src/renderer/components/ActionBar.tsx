import * as React from 'react'
import ActionButton from 'src/renderer/components/ActionButton'

interface ActionBarItem {
  id: number
  hotkey: string
  onClick?: () => void
  body: React.ReactNode
}

interface ActionBarProps {
  items: ActionBarItem[]
}

const ActionBar: React.FC<ActionBarProps> = ({ items }) => {
  return (
    <div className="ActionBar_root">
      {items.map((each) => (
        <ActionButton key={each.id} hotkey={each.hotkey} onClick={each.onClick}>
          {each.body}
        </ActionButton>
      ))}
    </div>
  )
}

export default ActionBar
