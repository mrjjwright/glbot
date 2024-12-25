export interface RGBAColor {
  r: number // Red (0-255)
  g: number // Green (0-255)
  b: number // Blue (0-255)
  a: number // Alpha (0-1)
}

export interface GradientConfig {
  foreground: RGBAColor
  background: RGBAColor
  target: RGBAColor
}

export const DEFAULT_COLORS = {
  grayScale: {
    foreground: { r: 98, g: 98, b: 98, a: 0.5 },
    background: { r: 168, g: 168, b: 168, a: 0.5 },
    target: { r: 255, g: 255, b: 255, a: 0.45 }
  } satisfies GradientConfig
} as const

export function interpolateColor(color1: RGBAColor, color2: RGBAColor, factor: number): RGBAColor {
  return {
    r: Math.round(color1.r + factor * (color2.r - color1.r)),
    g: Math.round(color1.g + factor * (color2.g - color1.g)),
    b: Math.round(color1.b + factor * (color2.b - color1.b)),
    a: color1.a + factor * (color2.a - color1.a)
  }
}

export function rgbaToString(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a.toFixed(2)})`
}

export function createCellGradient(config: GradientConfig) {
  return {
    getHeaderColor: (colIndex: number, totalCols: number): string => {
      const factor = totalCols > 1 ? colIndex / (totalCols - 1) : 0
      const color = interpolateColor(config.foreground, config.target, factor)
      return rgbaToString(color)
    },
    getCellColor: (
      rowIndex: number,
      colIndex: number,
      totalRows: number,
      totalCols: number
    ): string => {
      const maxIndexSum = totalRows - 1 + (totalCols - 1) || 1
      const indexSum = rowIndex + colIndex
      const factor = indexSum / maxIndexSum
      const color = interpolateColor(config.background, config.target, factor)
      return rgbaToString(color)
    }
  }
}
