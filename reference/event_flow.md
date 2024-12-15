# Event Flow Documentation

## Components & Responsibilities

### Chat Component (Chat.tsx)

- Handles AI responses
- Fires `JSONGenerated` event when new config received

### JSON History (JSONHistory.tsx)

- Manages version history in session storage
- Listens for `JSONGenerated` events
- Fires `JSONSelected` events
- Owns all storage logic

### Profile JSON Card (ControlPanel.tsx)

- Display-only component
- Listens for `JSONSelected` events
- Shows currently selected JSON

## Event Flow

1. AI Response → Chat fires `JSONGenerated` → JSON History stores & selects
2. User selects version → JSON History fires `JSONSelected` → Profile JSON Card displays
