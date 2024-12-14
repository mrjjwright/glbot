import * as React from 'react'

import ActionListItem from './ActionListItem'

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
          fireSelectionEvent(latest)
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
    const handleNewJSON = (e: JSONGeneratedEvent) => {
      const newVersion = {
        timestamp: Date.now(),
        config: e.detail.config,
        explanation: e.detail.explanation
      } satisfies JSONVersion

      setVersions((prev) => {
        const newVersions = [...prev, newVersion]
        persistVersions(newVersions)
        return newVersions
      })

      setSelectedVersion(newVersion)
      fireSelectionEvent(newVersion)
    }

    document.addEventListener('JSONGenerated', handleNewJSON)
    return () => document.removeEventListener('JSONGenerated', handleNewJSON)
  }, [])

  const fireSelectionEvent = (version: JSONVersion) => {
    const event = new CustomEvent('JSONSelected', {
      detail: version
    })
    document.dispatchEvent(event)
  }

  const handleVersionSelect = (version: JSONVersion) => {
    setSelectedVersion(version)
    fireSelectionEvent(version)
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
