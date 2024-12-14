import React from 'react'
import MatrixLoader from './MatrixLoader'

const MatrixOpening = () => {
  const [showMatrix, setShowMatrix] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setShowMatrix(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!showMatrix) return null

  return (
    <div
      style={{
        opacity: showMatrix ? 1 : 0,
        paddingLeft: '20px',
        transition: 'opacity 0.5s ease-out',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >
      <MatrixLoader rows={10} direction="top-to-bottom" />
    </div>
  )
}

export default MatrixOpening
