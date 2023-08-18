export function Square ({ children, updateBoard, index, styles }) {
  const handleclick = () => {
    updateBoard(index)
  }

  
  return (
		<div
			className={`${styles.square} ${styles[`glow-${children}`]}`}
			onClick={handleclick}
		>
			{children}
		</div>
	);
}
