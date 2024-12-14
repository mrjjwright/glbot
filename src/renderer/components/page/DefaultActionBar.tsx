import * as React from 'react'
import * as Utilities from 'src/renderer/common/utilities'

import { toggleDebugGrid } from 'src/renderer/components/DebugGrid'
import { useHotkeys } from 'src/renderer/modules/hotkeys'

import ActionBar from 'src/renderer/components/ActionBar'

const useGlobalNavigationHotkeys = () => {
  const onHandleSubmit = (event: KeyboardEvent) => {
    const target = event.target
    if (Utilities.isFocusableElement(target)) {
      event.preventDefault()
      ;(target as HTMLElement).click()
    }
  }

  const onHandleNextFocus = (event: KeyboardEvent) => {
    const target = event.target

    if (Utilities.isFocusableElement(target)) {
      event.preventDefault()

      const nextFocusable = Utilities.findNextFocusable(target as Element, 'next')
      if (nextFocusable) {
        nextFocusable.focus()
      }
    }
  }

  const onHandlePreviousFocus = (event: KeyboardEvent) => {
    const target = event.target

    if (Utilities.isFocusableElement(target)) {
      event.preventDefault()

      const previousFocusable = Utilities.findNextFocusable(target as Element, 'previous')
      if (previousFocusable) {
        previousFocusable.focus()
      }
    }
  }

  useHotkeys('ArrowDown', onHandleNextFocus)
  useHotkeys('ArrowUp', onHandlePreviousFocus)
  useHotkeys('ArrowRight', onHandleNextFocus)
  useHotkeys('ArrowLeft', onHandlePreviousFocus)
  useHotkeys('Enter', onHandleSubmit)
  useHotkeys(' ', onHandleSubmit)
}

interface DefaultActionBarProps {
  items?: {
    id: number
    hotkey: string
    onClick: () => void
    body: React.ReactNode
  }[]
}

const DefaultActionBar: React.FC<DefaultActionBarProps> = ({ items = [] }) => {
  useHotkeys('ctrl+t', () => Utilities.onHandleThemeChange())
  useHotkeys('ctrl+g', () => toggleDebugGrid())

  useGlobalNavigationHotkeys()

  return (
    <div className="DefaultActionBar_root">
      <ActionBar
        items={[
          {
            id: 1,
            hotkey: '⌃+T',
            onClick: () => Utilities.onHandleThemeChange(),
            body: 'Theme'
          },
          {
            id: 2,
            hotkey: '⌃+G',
            onClick: () => toggleDebugGrid(),
            body: 'Grid'
          },
          ...items
        ]}
      />
    </div>
  )
}

export default DefaultActionBar
