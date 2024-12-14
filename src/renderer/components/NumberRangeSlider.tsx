import * as React from 'react'

import type { JSX } from 'react'

interface RangerProps {
  defaultValue?: number
  max?: number
  min?: number
  step?: number
}

const NumberRangeSlider = ({
  defaultValue = 0,
  max = 5000,
  min = 0,
  step = 1
}: RangerProps): JSX.Element => {
  const sliderRef = React.useRef<HTMLInputElement>(null)
  const [displayValue, setDisplayValue] = React.useState<number>(defaultValue)

  const maxDigits = max.toString().length

  const padValue = (value: number): string => {
    return value.toString().padStart(maxDigits, '0')
  }

  React.useEffect((): void => {
    if (sliderRef.current) {
      sliderRef.current.value = String(defaultValue)
    }
    setDisplayValue(defaultValue)
  }, [defaultValue])

  const scrub = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value, 10)
    setDisplayValue(value)
  }

  return (
    <div className="NumberRangeSlider_root">
      <label className="NumberRangeSlider_left">
        <div className="NumberRangeSlider_amount">{padValue(displayValue)}</div>
      </label>
      <input
        className="NumberRangeSlider_slider"
        defaultValue={defaultValue}
        max={max}
        min={min}
        onChange={scrub}
        ref={sliderRef}
        role="slider"
        step={step}
        tabIndex={0}
        type="range"
      />
    </div>
  )
}

export default NumberRangeSlider
