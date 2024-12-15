interface JSONVersion {
  timestamp: number
  config: Record<string, any>
  explanation?: string
}

interface JSONSelectedUpdated extends CustomEvent<{ selectedIndex: number | null }> {
  type: 'JSONSelectedUpdated'
}

interface JSONHistoryUpdated
  extends CustomEvent<
    {
      id: number
      content: string
      createdAt: string
    }[]
  > {
  type: 'JSONHistoryUpdated'
}

type EventsDefinition = {
  JSONSelectedUpdated: { selectedIndex: number | null }
  JSONHistoryUpdated: {
    id: number
    content: string
    createdAt: string
  }[]
}
