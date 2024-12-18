import * as React from 'react'
import { classes } from '../utils/classes'

interface CellPickerProps {
  activeSheet: number
  sheetTree: SheetTree
  selectedCell: CellLocation
  onCellClick: (cell: CellLocationWithPath) => void;
  onFileDrop?: (file: File, location: CellLocation) => void;
}

const generateColumns = (numColumns: number): string[] => {
  const columns: string[] = []
  for (let i = 0; i < numColumns; i++) {
    columns.push(String.fromCharCode(65 + i))
  }
  return columns
}

const NUM_COLUMNS = 7
const NUM_ROWS = 20
const COLUMNS = generateColumns(NUM_COLUMNS)

const SHEETS = [
  { id: 0, name: 'Sheet 0' },
  { id: 1, name: 'Sheet 1' },
  { id: 2, name: 'Sheet 2' }
]

const CellPicker: React.FC<CellPickerProps> = ({ 
  activeSheet, 
  sheetTree, 
  selectedCell, 
  onCellClick,
  onFileDrop 
}) => {
  const [currentSheet, setSheet] = React.useState(activeSheet)
  const [dragState, setDragState] = React.useState<DragState>({
    isDragging: false,
    canDrop: false
  });
  const cells: React.ReactNode[] = []

  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col = 0; col < NUM_COLUMNS; col++) {
      const cell = sheetTree?.rows.get(row)?.cells.get(col)
      const isSelected = row === selectedCell.row && col === selectedCell.col
      const isDragTarget = dragState.cellLocation?.row === row && dragState.cellLocation?.col === col

      cells.push(
        <div
          key={`${row}-${col}`}
          onClick={() => cell ? onCellClick(cell): null}
          className={classes('CellPicker_cell', {
            'CellPicker_cell--active': !!cell,
            'CellPicker_cell--selected': isSelected,
            'CellPicker_cell--dragOver': isDragTarget && dragState.canDrop
          })}
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const items = Array.from(e.dataTransfer.items);
            const canDrop = items.some(item => item.kind === 'file');
            setDragState({ 
              isDragging: true, 
              canDrop,
              cellLocation: { row, col },
              dragEvent: e
            });
          }}
          onDragLeave={() => {
            setDragState({ isDragging: false, canDrop: false });
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0 && onFileDrop) {
              onFileDrop(files[0], { row, col });
            }
            setDragState({ isDragging: false, canDrop: false });
          }}
          tabIndex={0}
          aria-label={`${COLUMNS[col]}${row + 1}`}
        >
          {cell ? '•' : ''}
        </div>
      )
    }
  }

  const onSwitchPreviousSheet = () => {
    const newSheet = currentSheet - 1
    if (newSheet >= 0) {
      setSheet(newSheet)
    }
  }

  const onSwitchNextSheet = () => {
    const newSheet = currentSheet + 1
    if (newSheet < SHEETS.length) {
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
        <div className={'CellPicker_sheet'}>{SHEETS[currentSheet].name}</div>
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
