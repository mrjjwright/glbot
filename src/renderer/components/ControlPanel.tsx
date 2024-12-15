import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionBar from 'src/renderer/components/ActionBar'
import Panel from './Panel'
import JSONHistory from './JSONHistory'
import { subscribe, publish } from 'src/renderer/event_bus'

const placeholder = 'Paste your JSON configuration here...'

const ControlPanel = () => {
  const selected = window.db
    .prepare(
      `
      SELECT h.content 
      FROM ControlPanel_history h
      JOIN ControlPanel_selected s ON h.id = s.selected_index
      WHERE s.id = 1
    `
    )
    .get()

  const [_, setUpdateCounter] = React.useState(0)
  const historyCount = window.db
    .prepare('SELECT COUNT(*) as count FROM ControlPanel_history')
    .get().count

  const [showSidebar, setShowSidebar] = React.useState(historyCount > 0)
  const [currentText, setCurrentText] = React.useState(selected?.content || '')

  React.useEffect(() => {
    return subscribe('JSONSelectedUpdated', () => {
      setUpdateCounter((c) => c + 1)
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value)
  }

  const handleSave = () => {
    const result = window.db
      .prepare('INSERT INTO ControlPanel_history (content) VALUES (?)')
      .run(currentText)

    window.db
      .prepare('UPDATE ControlPanel_selected SET selected_index = ? WHERE id = 1')
      .run(result.lastInsertRowid)

    const historyItems = window.db
      .prepare('SELECT id, content, created_at as createdAt FROM ControlPanel_history')
      .all()

    if (historyItems.length === 1) {
      setShowSidebar(true)
    }

    publish('JSONHistoryUpdated', historyItems)
  }

  const actions = [
    {
      id: 1,
      hotkey: 'S',
      body: 'Save',
      onClick: handleSave
    },
    {
      id: 2,
      hotkey: '→',
      body: 'Reset',
      onClick: () => false
    },
    {
      id: 3,
      hotkey: '→',
      body: 'Default',
      onClick: () => false
    }
  ]

  return (
    <Panel title={'Control'}>
      <ActionBar items={actions} />
      <div className="ControlPanel_root">
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              className="ControlPanel_sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <JSONHistory />
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          className="ControlPanel_textarea"
          placeholder={placeholder}
          value={currentText}
          onChange={handleChange}
        />
      </div>
    </Panel>
  )
}

export default ControlPanel
