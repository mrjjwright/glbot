import styles from './DataTable.module.scss'

import * as React from 'react'

interface TableProps {
  data: string[][]
}

interface RGBAColor {
  r: number
  g: number
  b: number
  a: number
}

const BASE_FOREGROUND_RGBA: RGBAColor = { r: 98, g: 98, b: 98, a: 0.5 }
const BASE_BACKGROUND_RGBA: RGBAColor = { r: 168, g: 168, b: 168, a: 0.5 }
const ALPHA = 0.4

function interpolateColor(color1: RGBAColor, color2: RGBAColor, factor: number): RGBAColor {
  return {
    r: Math.round(color1.r + factor * (color2.r - color1.r)),
    g: Math.round(color1.g + factor * (color2.g - color1.g)),
    b: Math.round(color1.b + factor * (color2.b - color1.b)),
    a: color1.a + factor * (color2.a - color1.a)
  }
}

const DataTable: React.FC<TableProps> = ({ data }) => {
  const tableRef = React.useRef<HTMLTableElement>(null)

  const targetColorHeader: RGBAColor = { r: 255, g: 255, b: 255, a: ALPHA }
  const targetColorData: RGBAColor = { r: 255, g: 255, b: 255, a: ALPHA }

  return (
    <table className={styles.root} ref={tableRef}>
      <tbody className={styles.body}>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className={styles.row} tabIndex={0} onClick={() => alert('testing')}>
            {row.map((cellContent, colIndex) => {
              let backgroundColor: string

              if (rowIndex === 0) {
                const lightnessFactor = row.length > 1 ? colIndex / (row.length - 1) : 0
                const newColor = interpolateColor(
                  BASE_FOREGROUND_RGBA,
                  targetColorHeader,
                  lightnessFactor
                )
                backgroundColor = `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a.toFixed(2)})`
              } else {
                const numRows = data.length - 1
                const maxIndexSum = numRows - 1 + (row.length - 1) || 1
                const indexSum = rowIndex - 1 + colIndex
                const lightnessFactor = indexSum / maxIndexSum
                const newColor = interpolateColor(
                  BASE_BACKGROUND_RGBA,
                  targetColorData,
                  lightnessFactor
                )
                backgroundColor = `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a.toFixed(2)})`
              }

              return (
                <td key={colIndex} className={styles.column} style={{ backgroundColor }}>
                  {cellContent}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
