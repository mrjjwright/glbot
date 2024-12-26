type DragState = {
  isDragging: boolean
  canDrop: boolean
  cellLocation?: CellLocation
  dragEvent?: React.DragEvent<HTMLDivElement>
}
