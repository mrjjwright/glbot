import * as React from 'react'
import ActionBar from 'src/renderer/components/ActionBar'
import Card from './Card'
import JSONHistory from './JSONHistory'

function ProfileActions() {
  const PROFILE_ACTIONS = [
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

  return <ActionBar items={PROFILE_ACTIONS} />
}

const placeholder = 'Paste your JSON configuration here...'

const ProfileJSONCard = () => {
  const [selectedJSON, setSelectedJSON] = React.useState<string>('')

  React.useEffect(() => {
    const handleJSONSelected = (e: CustomEvent<JSONVersion>) => {
      setSelectedJSON(JSON.stringify(e.detail.config, null, 2))
    }

    document.addEventListener('JSONSelected', handleJSONSelected)
    return () => document.removeEventListener('JSONSelected', handleJSONSelected)
  }, [])

  return (
    <Card title={'Copy/Paste JSON'}>
      <ProfileActions />
      <div className="ProfileJSONCard_root">
        <div className="ProfileJSONCard_sidebar">
          <JSONHistory />
        </div>
        <textarea
          className="ProfileJSONCard_textarea"
          placeholder={placeholder}
          value={selectedJSON}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              const event = new CustomEvent('JSONGenerated', {
                detail: { config: parsed }
              })
              document.dispatchEvent(event)
            } catch (e) {
              // Invalid JSON - ignore
            }
          }}
        />
      </div>
    </Card>
  )
}

export default ProfileJSONCard
