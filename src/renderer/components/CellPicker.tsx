import * as React from 'react'

interface CellPickerProps {
  activeSheet?: number
}
const generateColumns = (numColumns: number): string[] => {
  const columns: string[] = []
  for (let i = 0; i < numColumns; i++) {
    columns.push(String.fromCharCode(65 + i))
  }
  return columns
}

const NUM_COLUMNS = 7
const COLUMNS = generateColumns(NUM_COLUMNS)

const SHEETS = [
  { id: 1, name: 'Sheet 1' },
  { id: 2, name: 'Sheet 2' },
  { id: 3, name: 'Sheet 3' }
]

const MAX_CELLS = NUM_COLUMNS * 5

const CellPicker: React.FC<CellPickerProps> = ({ activeSheet }) => {
  const [currentSheet, setSheet] = React.useState(activeSheet || 1)
  const cells: React.ReactNode[] = []

  for (let i = 0; i < MAX_CELLS; i++) {
    cells.push(
      <div key={i} className={'CellPicker_cell'} tabIndex={0} aria-label={`Cell-${i}`}>
        {'test'}
      </div>
    )
  }

  const onSwitchPreviousSheet = () => {
    const newSheet = currentSheet - 1
    if (newSheet >= 1) {
      setSheet(newSheet)
    }
  }

  const onSwitchNextSheet = () => {
    const newSheet = currentSheet + 1
    if (newSheet <= 3) {
      setSheet(newSheet)
    }
  }

  return (
    <div
      className={'CellPicker_root'}
      style={{ '--grid-columns': NUM_COLUMNS } as React.CSSProperties}
    >
      <div className={'CellPicker_controls'}>
        <button
          type="button"
          className={'CellPicker_button'}
          onClick={onSwitchPreviousSheet}
          aria-label="Previous sheet"
        >
          ◄
        </button>
        <div className={'CellPicker_sheet'}>{SHEETS[currentSheet - 1].name}</div>
        <button
          type="button"
          className={'CellPicker_button'}
          onClick={onSwitchNextSheet}
          aria-label="Next sheet"
        >
          ►
        </button>
      </div>
      <div className={'CellPicker_header'}>
        {COLUMNS.map((col) => (
          <div key={col} className={'CellPicker_cell'}>
            {col}
          </div>
        ))}
      </div>
      <div className={'CellPicker_grid'}>{cells}</div>
    </div>
  )
}

export default CellPicker
