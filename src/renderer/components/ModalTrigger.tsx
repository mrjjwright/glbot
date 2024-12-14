import * as React from 'react'

import { useModals } from 'src/renderer/components/page/ModalContext'

interface ModalTriggerProps {
  children: React.ReactElement<any>
  modal: React.ComponentType<any>
  modalProps?: Record<string, any>
}

function ModalTrigger({ children, modal, modalProps = {} }: ModalTriggerProps) {
  const { open } = useModals()

  const onHandleOpenModal = () => {
    open(modal, modalProps)
  }

  return React.cloneElement(children, {
    onClick: onHandleOpenModal
  })
}

export default ModalTrigger
