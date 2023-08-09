import { useState } from 'react'
import { POSSIBLEWINS, TURNS } from '../constants'
import { Square } from './Square'
import WinnerModal from './Winner-modal'
import confetti from 'canvas-confetti'

export default function Board () {
  const [turn, setTurn] = useState(() => {
    const localStorageWin = window.localStorage.getItem('turn')
    return localStorageWin ?? TURNS.X
  })

  const [board, setBoard] = useState(() => {
    const localStorageBoard = window.localStorage.getItem('board')
    if (localStorageBoard) return JSON.parse(localStorageBoard)
    return Array(9).fill(null)
  })

  const [winner, setWinner] = useState(() => {
    const localStorageWinner = window.localStorage.getItem('winner')
    return localStorageWinner ?? null
  })

  function checkWinner (newBoard) {
    for (const possibleWin of POSSIBLEWINS) {
      const [a, b, c] = possibleWin
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        window.localStorage.setItem('winner', newBoard[a])
        return newBoard[a]
      }
    }
    return null
  }

  function checkDraw (newBoard) {
    return newBoard.every((square) => square !== null)
  }

  function updateBoard (index) {
    if (board[index]) return

    const newTurn = turn === TURNS.X ? TURNS.Y : TURNS.X
    setTurn(newTurn)
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newWinner = checkWinner(newBoard)

    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkDraw(newBoard)) {
      setWinner(false)
    }

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
  }

  const restartBoard = () => {
    setTurn(TURNS.X)
    setBoard(Array(9).fill(null))
    setWinner(null)

    window.localStorage.clear()
  }

  return (
    <div className='game-container'>
      <WinnerModal restartBoard={restartBoard} winner={winner} />
      <h1>TIC TAC TOE</h1>
      <div className='game-grid'>
        {
          board.map((el, i) => {
            return <Square key={i} index={i} updateBoard={updateBoard}>{el}</Square>
          })
        }
      </div>
      <h2>Turn of </h2>
      <div className='turns'>
        <span className={turn === TURNS.X ? 'selected' : ''}>{TURNS.X}</span>
        <span className={turn === TURNS.Y ? 'selected' : ''}>{TURNS.Y}</span>
      </div>
      <button onClick={restartBoard}>
        Restart
      </button>
    </div>
  )
}
