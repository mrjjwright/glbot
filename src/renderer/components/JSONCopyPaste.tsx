import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionBar from 'src/renderer/components/ActionBar'
import Card from './Card'
import JSONHistory from './JSONHistory'
import { subscribe, publish } from 'src/renderer/event_bus'

const placeholder = 'Paste your JSON configuration here...'

const JSONCopyPaste = () => {
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

  const [_, setUpdateCounter] = React.useState(0)
  const historyCount = window.db
    .prepare('SELECT COUNT(*) as count FROM JSONCopyPaste_history')
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
      .prepare('INSERT INTO JSONCopyPaste_history (content) VALUES (?)')
      .run(currentText)

    window.db
      .prepare('UPDATE JSONCopyPaste_selected SET selected_index = ? WHERE id = 1')
      .run(result.lastInsertRowid)

    const historyItems = window.db
      .prepare('SELECT id, content, created_at as createdAt FROM JSONCopyPaste_history')
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
    <Card title={'Copy/Paste JSON'}>
      <ActionBar items={actions} />
      <div className="JSONCopyPaste_root">
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              className="JSONCopyPaste_sidebar"
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
          className="JSONCopyPaste_textarea"
          placeholder={placeholder}
          value={currentText}
          onChange={handleChange}
        />
      </div>
    </Card>
  )
}

export default JSONCopyPaste
