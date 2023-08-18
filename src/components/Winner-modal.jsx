import { TURNS } from '../constants'

export default function WinnerModal ({ winner, restartBoard, styles }) {
  if (winner === null) return
  const winnerText = winner === false ? 'It\'s a Draw' : 'The winner is:'

  return (
		<div className={styles['winner-modal-container']}>
			<div className={styles['modal']}>
				<h2>{winnerText}</h2>
				<h1>{winner === false ? `${TURNS.P1}/${TURNS.P2}` : winner}</h1>
				<button className={styles.resetButton} onClick={restartBoard}>
					Restart
				</button>
			</div>
		</div>
	);
}
