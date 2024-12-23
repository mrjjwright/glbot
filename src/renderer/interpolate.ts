/**
 * Types and utilities for creating gradient color effects in tables and other components
 */

/**
 * Represents an RGBA color with values between 0-255 for RGB and 0-1 for alpha
 */
export interface RGBAColor {
  r: number // Red (0-255)
  g: number // Green (0-255)
  b: number // Blue (0-255)
  a: number // Alpha (0-1)
}

/**
 * Configuration for gradient generation
 */
export interface GradientConfig {
  baseColor: RGBAColor // Starting color
  targetColor: RGBAColor // Ending color
  alpha?: number // Optional override for alpha value
}

/**
 * Default color configurations that can be used as starting points
 */
export const DEFAULT_COLORS = {
  grayScale: {
    foreground: { r: 98, g: 98, b: 98, a: 0.5 },
    background: { r: 168, g: 168, b: 168, a: 0.5 },
    target: { r: 255, g: 255, b: 255, a: 0.45 }
  }
} as const

/**
 * Interpolates between two RGBA colors based on a factor between 0 and 1
 *
 * @param color1 - Starting color
 * @param color2 - Ending color
 * @param factor - Number between 0 and 1 representing position between colors
 * @returns Interpolated RGBA color
 */
export function interpolateColor(color1: RGBAColor, color2: RGBAColor, factor: number): RGBAColor {
  return {
    r: Math.round(color1.r + factor * (color2.r - color1.r)),
    g: Math.round(color1.g + factor * (color2.g - color1.g)),
    b: Math.round(color1.b + factor * (color2.b - color1.b)),
    a: color1.a + factor * (color2.a - color1.a)
  }
}

/**
 * Converts an RGBA color object to a CSS rgba string
 *
 * @param color - RGBA color object
 * @returns CSS rgba string (e.g. "rgba(255, 255, 255, 0.5)")
 */
export function rgbaToString(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a.toFixed(2)})`
}

/**
 * Creates a gradient function that can be used to generate colors for a table
 *
 * @param config - Gradient configuration
 * @returns Object with functions for generating header and cell colors
 *
 * @example
 * // Create a gradient generator with default gray scale colors
 * const gradient = createTableGradient({
 *   baseColor: DEFAULT_COLORS.grayScale.foreground,
 *   targetColor: DEFAULT_COLORS.grayScale.target
 * });
 *
 * // Generate color for a header cell
 * const headerColor = gradient.getHeaderColor(columnIndex, totalColumns);
 *
 * // Generate color for a data cell
 * const cellColor = gradient.getCellColor(rowIndex, columnIndex, totalRows, totalColumns);
 */
export function createTableGradient(config: GradientConfig) {
  return {
    /**
     * Generates a color for a header cell based on its position
     */
    getHeaderColor: (colIndex: number, totalCols: number): string => {
      const factor = totalCols > 1 ? colIndex / (totalCols - 1) : 0
      const color = interpolateColor(config.baseColor, config.targetColor, factor)
      return rgbaToString(color)
    },

    /**
     * Generates a color for a data cell based on its position
     */
    getCellColor: (
      rowIndex: number,
      colIndex: number,
      totalRows: number,
      totalCols: number
    ): string => {
      const maxIndexSum = totalRows - 1 + (totalCols - 1) || 1
      const indexSum = rowIndex + colIndex
      const factor = indexSum / maxIndexSum
      const color = interpolateColor(config.baseColor, config.targetColor, factor)
      return rgbaToString(color)
    }
  }
}

/**
 * Usage Example:
 *
 * // Create a gradient generator
 * const tableGradient = createTableGradient({
 *   baseColor: DEFAULT_COLORS.grayScale.background,
 *   targetColor: DEFAULT_COLORS.grayScale.target
 * });
 *
 * // In your table component:
 * const backgroundColor = rowIndex === 0
 *   ? tableGradient.getHeaderColor(colIndex, row.length)
 *   : tableGradient.getCellColor(rowIndex - 1, colIndex, data.length - 1, row.length);
 *
 * <td style={{ backgroundColor }}>
 *   {cellContent}
 * </td>
 */
