import * as React from 'react'

import { useModals } from 'src/renderer/components/page/ModalContext'

interface ModalStackProps {}

const ModalStack: React.FC<ModalStackProps> = () => {
  const { modalStack } = useModals()

  const totalModals = modalStack.length

  return (
    <div className="ModalStack_root">
      {modalStack.map((modalState, index) => {
        const { key, component: ModalComponent, props } = modalState

        const offsetFromLast = totalModals - 1 - index
        const translateY = -offsetFromLast * 40
        const blur = offsetFromLast * 1.1

        return (
          <div
            key={key}
            className="ModalStack_item"
            style={{
              zIndex: 10 + index,
              transform: `translateY(${translateY}px)`,
              filter: `blur(${blur}px)`
            }}
          >
            <ModalComponent {...props} />
          </div>
        )
      })}
    </div>
  )
}

export default ModalStack
