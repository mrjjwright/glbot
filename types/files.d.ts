declare module '*.txt' {
  const content: string
  export default content
}

declare module '*.md' {
  const content: string
  export default content
}

declare module '*.xml' {
  const content: string
  export default content
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}
