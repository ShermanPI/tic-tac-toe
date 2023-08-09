export function Square ({ children, updateBoard, index }) {
  const handleclick = () => {
    updateBoard(index)
  }

  return (
    <div className={`square glow-${children}`} onClick={handleclick}>
      {children}
    </div>
  )
}
