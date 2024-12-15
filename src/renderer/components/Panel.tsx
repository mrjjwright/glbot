import * as React from 'react'

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  title?: string | any
  mode?: string | any
}

const Panel: React.FC<PanelProps> = ({ children, mode, title }) => {
  let titleElement = (
    <header className="Panel_action">
      <div className="Panel_left" aria-hidden="true"></div>
      <h2 className="Panel_title">{title}</h2>
      <div className="Panel_right" aria-hidden="true"></div>
    </header>
  )

  if (mode === 'left') {
    titleElement = (
      <header className="Panel_action">
        <div className="Panel_leftCorner" aria-hidden="true"></div>
        <h2 className="Panel_title">{title}</h2>
        <div className="Panel_right" aria-hidden="true"></div>
      </header>
    )
  }

  if (mode === 'right') {
    titleElement = (
      <header className="Panel_action">
        <div className="Panel_left" aria-hidden="true"></div>
        <h2 className="Panel_title">{title}</h2>
        <div className="Panel_rightCorner" aria-hidden="true"></div>
      </header>
    )
  }

  return (
    <article className="Panel_panel">
      {titleElement}
      <section className="Panel_children">{children}</section>
    </article>
  )
}

export default Panel
