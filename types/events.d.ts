interface JSONVersion {
  timestamp: number
  config: Record<string, any>
  explanation?: string
}

interface JSONGeneratedEvent extends CustomEvent<JSONVersion> {
  type: 'JSONGenerated'
}

interface JSONSelectedEvent extends CustomEvent<JSONVersion> {
  type: 'JSONSelected'
}
