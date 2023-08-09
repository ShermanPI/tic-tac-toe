import { TURNS } from '../constants'

export default function WinnerModal ({ winner, restartBoard }) {
  if (winner === null) return
  const winnerText = winner === false ? 'It\'s a Draw' : 'The winner is:'

  return (
    <div className='winner-modal-container'>
      <div className='modal'>
        <h2>{winnerText}</h2>
        <h1>{winner === false ? `${TURNS.X}/${TURNS.Y}` : winner}</h1>
        <button onClick={restartBoard}>
          Restart
        </button>
      </div>
    </div>
  )
}
