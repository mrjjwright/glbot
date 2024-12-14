import * as React from 'react'

interface DefaultLayoutProps {
  previewPixelSRC: string
  children?: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ previewPixelSRC, children }) => {
  return (
    <div className="DefaultLayout_body">
      <img className="DefaultLayout_pixel" src={previewPixelSRC} alt="" />
      {children}
    </div>
  )
}

export default DefaultLayout
