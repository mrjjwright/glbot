import * as React from 'react'
import * as Utilities from 'src/renderer/common/utilities'

interface CheckboxProps {
  style?: React.CSSProperties
  checkboxStyle?: React.CSSProperties
  name: string
  defaultChecked?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  tabIndex?: number
  children?: React.ReactNode
}

const Checkbox: React.FC<CheckboxProps> = ({
  style,
  name,
  defaultChecked = false,
  onChange,
  children
}) => {
  const checkboxId = `${name}-checkbox`
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [isChecked, setIsChecked] = React.useState(defaultChecked)
  const [isFocused, setIsFocused] = React.useState(false)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        inputRef.current?.click()
        break
      case 'ArrowUp':
      case 'ArrowLeft': {
        event.preventDefault()
        const previousFocusable = Utilities.findNextFocusable(document.activeElement, 'previous')
        previousFocusable?.focus()
        break
      }
      case 'ArrowDown':
      case 'ArrowRight': {
        event.preventDefault()
        const nextFocusable = Utilities.findNextFocusable(document.activeElement, 'next')
        nextFocusable?.focus()
        break
      }
      default:
        break
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedStatus = event.target.checked
    setIsChecked(newCheckedStatus)
    if (onChange) {
      onChange(event)
    }
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <div
      className={Utilities.classNames('Checkbox_section', {
        'Checkbox_checked': isChecked,
        'Checkbox_focused': isFocused
      })}
      style={style}
    >
      <div className="Checkbox_relative">
        <input
          className="Checkbox_input"
          id={checkboxId}
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={0}
          ref={inputRef}
        />
        <label className="Checkbox_figure" htmlFor={checkboxId}>
          {isChecked ? '╳' : '\u00A0'}
        </label>
      </div>
      <div className="Checkbox_right">{children}</div>
    </div>
  )
}

export default Checkbox
