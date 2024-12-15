import * as React from 'react'
import ActionListItem from './ActionListItem'
import { subscribe, publish } from 'src/renderer/event_bus'

export default function JSONHistory() {
  const [versions, setVersions] = React.useState<JSONVersion[]>([])
  const [selectedVersion, setSelectedVersion] = React.useState<JSONVersion>()

  // Load initial history
  React.useEffect(() => {
    const loadHistory = () => {
      const stored = sessionStorage.getItem('json-history')
      if (stored) {
        const loadedVersions = JSON.parse(stored)
        setVersions(loadedVersions)
        // Select latest version
        if (loadedVersions.length > 0) {
          const latest = loadedVersions[loadedVersions.length - 1]
          setSelectedVersion(latest)
          publish('JSONSelected', latest)
        }
      }
    }

    loadHistory()
    // Also listen for storage events from other tabs
    window.addEventListener('storage', loadHistory)
    return () => window.removeEventListener('storage', loadHistory)
  }, [])

  const persistVersions = (newVersions: JSONVersion[]) => {
    sessionStorage.setItem('json-history', JSON.stringify(newVersions))
  }

  // Listen for new JSONs
  React.useEffect(() => {
    const unsubscribe = subscribe('JSONGenerated', (payload) => {
      const newVersion = {
        timestamp: payload.timestamp,
        config: payload.config,
        explanation: payload.explanation
      }

      setVersions((prev) => {
        const newVersions = [...prev, newVersion]
        persistVersions(newVersions)
        return newVersions
      })

      setSelectedVersion(newVersion)
      publish('JSONSelected', newVersion)
    })

    return unsubscribe
  }, [])

  const handleVersionSelect = (version: JSONVersion) => {
    setSelectedVersion(version)
    publish('JSONSelected', version)
  }

  return (
    <div className="JSONHistory_history">
      {versions.map((version, index) => (
        <ActionListItem
          key={version.timestamp}
          onClick={() => handleVersionSelect(version)}
          icon="→"
          style={{
            background:
              version.timestamp === selectedVersion?.timestamp
                ? 'var(--theme-focused-foreground)'
                : 'transparent'
          }}
        >
          v{index + 1}
        </ActionListItem>
      ))}
    </div>
  )
}
