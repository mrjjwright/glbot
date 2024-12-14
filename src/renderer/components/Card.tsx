import * as React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  title?: string | any
  mode?: string | any
}

const Card: React.FC<CardProps> = ({ children, mode, title }) => {
  let titleElement = (
    <header className="Card_root">
      <div className="Card_left" aria-hidden="true"></div>
      <h2 className="Card_title">{title}</h2>
      <div className="Card_right" aria-hidden="true"></div>
    </header>
  )

  if (mode === 'left') {
    titleElement = (
      <header className="Card_root">
        <div className="Card_leftCorner" aria-hidden="true"></div>
        <h2 className="Card_title">{title}</h2>
        <div className="Card_right" aria-hidden="true"></div>
      </header>
    )
  }

  if (mode === 'right') {
    titleElement = (
      <header className="Card_root">
        <div className="Card_left" aria-hidden="true"></div>
        <h2 className="Card_title">{title}</h2>
        <div className="Card_rightCorner" aria-hidden="true"></div>
      </header>
    )
  }

  return (
    <article className="Card_root">
      {titleElement}
      <section className="Card_children">{children}</section>
    </article>
  )
}

export default Card
