import Card from 'src/renderer/components/Card'
import Text from 'src/renderer/components/Text'
import BlockLoader from 'src/renderer/components/BlockLoader'
import Button from 'src/renderer/components/Button'
import { CoreMessage } from 'ai'
import ActionBar from './ActionBar'
import GLWebLogo from 'src/renderer/components/GLWebLogo'
import Badge from './Badge'
import * as ReactDOM from 'react-dom'
import * as React from 'react'

// types
interface ChatProps {
  endpoint?: string
}

// constants
const COMMON_ACTIONS = [
  {
    id: 1,
    hotkey: '→',
    body: 'Exclude header/footer from specific pages'
  },
  {
    id: 2,
    hotkey: '→',
    body: 'Add new language'
  },
  {
    id: 3,
    hotkey: '→',
    body: 'Configure URL patterns'
  }
]

export default function Chat({ endpoint = '/api/chat' }: ChatProps) {
  const [input, setInput] = React.useState('')
  const [messages, setMessages] = React.useState<CoreMessage[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newUserMessage = { role: 'user', content: input } as CoreMessage
    ReactDOM.flushSync(() => {
      setIsLoading(true)
      setMessages((msgs) => [...msgs, newUserMessage])
    })

    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    })

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages, newUserMessage]
        })
      })

      if (!response.ok) {
        throw new Error(
          `Failed to get response (${response.status}). Please try again or contact support if the issue persists.`
        )
      }

      const data: {
        message: CoreMessage
        configUpdate?: {
          action: 'update' | 'none'
          config?: Record<string, any>
          explanation?: string
        }
      } = await response.json()

      // Handle the chat message
      setMessages((msgs) => [...msgs, data.message])

      // Handle config updates if present
      if (data.configUpdate?.action === 'update' && data.configUpdate.config) {
        const event = new CustomEvent('JSONGenerated', {
          detail: {
            config: data.configUpdate.config,
            explanation: data.configUpdate.explanation
          }
        })
        document.dispatchEvent(event)
      }
    } catch (err) {
      setError(
        new Error(
          (err as Error).message ||
            'Something went wrong with the chat. Please try refreshing the page.'
        )
      )
      console.error('Chat error:', err)
    } finally {
      ReactDOM.flushSync(() => {
        setIsLoading(false)
        setInput('')
      })
      textareaRef.current?.focus()
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleClear = () => {
    setMessages([messages[0]]) // Keep system message
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const placeholder =
    'e.g I need to exclude a header and footer from translation only on some pages'

  return (
    <Card title="CHAT">
      <ActionBar items={COMMON_ACTIONS} />

      <div ref={chatContainerRef} className="Chat_chatContainer">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`Chat_message ${message.role === 'user' ? 'Chat_user' : 'Chat_assistant'}`}
          >
            {message.role === 'assistant' && <GLWebLogo />}
            {message.role === 'user' && <Badge style={{ width: '8ch' }}>You</Badge>}
            <Text>
              {typeof message.content === 'string'
                ? message.content
                : message.content
                    .filter((part) => part.type === 'text')
                    .map((part, partIndex) => <span key={partIndex}>{part.text}</span>)}
            </Text>
          </div>
        ))}

        {isLoading && (
          <div className="Chat_loadingContainer">
            <BlockLoader mode={1} />
            <Text>Thinking...</Text>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="Chat_form">
        <textarea
          ref={textareaRef}
          className="Chat_textarea"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <div className="Chat_buttonGroup">
          <Button
            theme="SECONDARY"
            onClick={handleClear}
            isDisabled={messages.length === 0}
            type="button"
          >
            Clear Chat
          </Button>
          {isLoading && (
            <Button theme="SECONDARY" onClick={stop} type="button">
              Stop
            </Button>
          )}
          <Button theme="PRIMARY" isDisabled={isLoading || !input.trim()} type="submit">
            {isLoading ? (
              <>
                <BlockLoader mode={1} /> Sending
              </>
            ) : (
              <div className="Chat_buttonContent">
                Send
                <span className="Chat_shortcut">⇧↵</span>
              </div>
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="Chat_errorContainer">
          <Text color="error">Error: {error.message}</Text>
        </div>
      )}
    </Card>
  )
}
