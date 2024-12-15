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
  const [selectedJSON, setSelectedJSON] = React.useState<string>('')

  React.useEffect(() => {
    const unsubscribe = subscribe('JSONSelected', (payload) => {
      setSelectedJSON(JSON.stringify(payload.config, null, 2))
    })
    return unsubscribe
  }, [])

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
          value={selectedJSON}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              publish('JSONGenerated', {
                timestamp: Date.now(),
                config: parsed
              })
            } catch (e) {
              // Invalid JSON - ignore
            }
          }}
        />
      </div>
    </Card>
  )
}

export default JSONCopyPaste
