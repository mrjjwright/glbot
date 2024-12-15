import styles from './modals/ModalAlert.module.scss'

import * as React from 'react'
import * as Utilities from 'src/renderer/common/utilities'

import { useModals } from 'src/renderer/components/page/ModalContext'

import Button from 'src/renderer/components/Button'
import Panel from 'src/renderer/components/Panel'

interface ModalAlertProps {
  buttonText?: string | any
  message: string
  children?: React.ReactNode
  onEscape?: () => void
  onClose?: () => void
}

function ModalAlert({ message, buttonText, children, onClose, onEscape }: ModalAlertProps) {
  const { close } = useModals()

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'escape') {
        close()
        console.log('escape')
        onEscape && onEscape()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onEscape])

  const handleClose = () => {
    if (onClose) onClose()
    close()
  }

  return (
    <div className={styles.root}>
      <Panel title={message}>
        {children}
        <Button onClick={handleClose}>
          {Utilities.isEmpty(buttonText) ? 'Close' : buttonText}
        </Button>
      </Panel>
    </div>
  )
}

export default ModalAlert
