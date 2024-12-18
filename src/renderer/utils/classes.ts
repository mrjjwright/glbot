export function classes(
  ...args: (string | boolean | undefined | null | { [key: string]: boolean })[]
): string {
  return args
    .map((arg) => {
      if (!arg) return ''
      if (typeof arg === 'string') return arg
      if (typeof arg === 'object') {
        return Object.entries(arg)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ')
      }
      return ''
    })
    .filter(Boolean)
    .join(' ')
}
