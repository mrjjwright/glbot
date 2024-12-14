import * as React from "react"

interface GLWebLogoProps {
  className?: string
}

const GLWebLogo: React.FC<GLWebLogoProps> = ({ className }) => {
  return (
    <img
      src="/glweb.svg"
      alt="GLWeb Logo"
      className={className}
      style={{
        width: "calc(40px * var(--theme-line-height-base))",
        height: "calc(17px * var(--theme-line-height-base))",
        objectFit: "contain",
      }}
    />
  )
}

export default GLWebLogo
