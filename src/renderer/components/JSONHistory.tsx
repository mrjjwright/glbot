import * as React from 'react'
import ActionListItem from './ActionListItem'
import { subscribe, publish } from 'src/renderer/event_bus'

export default function JSONHistory() {
  const [_, setUpdateCounter] = React.useState(0)

  React.useEffect(() => {
    return subscribe('JSONHistoryUpdated', () => {
      setUpdateCounter((c) => c + 1)
    })
  }, [])

  const selectedIndex = window.db
    .prepare('SELECT selected_index FROM ControlPanel_selected WHERE id = 1')
    .get().selected_index

  const historyItems = window.db
    .prepare('SELECT id, content, created_at FROM ControlPanel_history ORDER BY id ASC')
    .all()

  const handleVersionSelect = (index: number) => {
    window.db.prepare('UPDATE ControlPanel_selected SET selected_index = ? WHERE id = 1').run(index)

    publish('JSONSelectedUpdated', { selectedIndex: index })
  }

  return (
    <div className="JSONHistory_history">
      {historyItems.map((item, index) => (
        <ActionListItem
          key={item.id}
          onClick={() => handleVersionSelect(item.id)}
          icon="→"
          style={{
            background:
              item.id === selectedIndex ? 'var(--theme-focused-foreground)' : 'transparent'
          }}
        >
          v{index + 1}
        </ActionListItem>
      ))}
    </div>
  )
}
