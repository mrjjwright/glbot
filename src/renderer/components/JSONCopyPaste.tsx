import * as React from 'react'
import ActionBar from 'src/renderer/components/ActionBar'
import Card from './Card'
import JSONHistory from './JSONHistory'
import { subscribe, publish } from 'src/renderer/event_bus'

function Actions() {
  const actions = [
    {
      id: 1,
      hotkey: '→',
      body: 'Reset',
      onClick: () => false
    },
    {
      id: 2,
      hotkey: '→',
      body: 'Default',
      onClick: () => false
    }
  ]

  return <ActionBar items={actions} />
}

const placeholder = 'Paste your JSON configuration here...'

const JSONCopyPaste = () => {
  const [_, setUpdateCounter] = React.useState(0)

  React.useEffect(() => {
    return subscribe('JSONSelectedUpdated', () => {
      setUpdateCounter((c) => c + 1)
    })
  }, [])

  const selected = window.db
    .prepare(
      `
      SELECT h.content 
      FROM JSONCopyPaste_history h
      JOIN JSONCopyPaste_selected s ON h.id = s.selected_index
      WHERE s.id = 1
    `
    )
    .get()

  const handleChange = (value: string) => {
    try {
      JSON.parse(value)

      const result = window.db
        .prepare('INSERT INTO JSONCopyPaste_history (content) VALUES (?)')
        .run(value)

      window.db
        .prepare('UPDATE JSONCopyPaste_selected SET selected_index = ? WHERE id = 1')
        .run(result.lastInsertRowid)

      const historyItems = window.db
        .prepare('SELECT id, content, created_at as createdAt FROM JSONCopyPaste_history')
        .all()

      publish('JSONHistoryUpdated', historyItems)
    } catch (e) {
      // Invalid JSON - ignore
    }
  }

  return (
    <Card title={'Copy/Paste JSON'}>
      <Actions />
      <div className="JSONCopyPaste_root">
        <div className="JSONCopyPaste_sidebar">
          <JSONHistory />
        </div>
        <textarea
          className="JSONCopyPaste_textarea"
          placeholder={placeholder}
          value={selected?.content || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </Card>
  )
}

export default JSONCopyPaste
