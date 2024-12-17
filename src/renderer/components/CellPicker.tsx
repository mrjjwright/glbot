import * as React from 'react'

interface CellPickerProps {
  activeSheet?: number
  sheetTree?: SheetTree
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
  { id: 0, name: 'Sheet 0' },
  { id: 1, name: 'Sheet 1' },
  { id: 2, name: 'Sheet 2' }
]

const CellPicker: React.FC<CellPickerProps> = ({ activeSheet, sheetTree }) => {
  const [currentSheet, setSheet] = React.useState(activeSheet || 1)
  const cells: React.ReactNode[] = []

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < NUM_COLUMNS; col++) {
      const rowTree = sheetTree?.rows.get(row)
      const isActive = rowTree?.cells.get(col) || false
      cells.push(
        <div
          key={`${row}-${col}`}
          className={`CellPicker_cell${isActive ? ' CellPicker_cell--active' : ''}`}
          tabIndex={0}
          aria-label={`${COLUMNS[col]}${row + 1}`}
        >
          {isActive ? '•' : ''}
        </div>
      )
    }
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
