import { useState } from 'react';
import { POSSIBLEWINS, TURNS } from '../constants';
import { Square } from './Square';
import WinnerModal from './Winner-modal';
import confetti from 'canvas-confetti';
import styles from './styles/App.module.scss';

const Board = () => {
	const [mode, setMode] = useState(1);

	const [turn, setTurn] = useState(() => {
		const localStorageWin = window.localStorage.getItem('turn');
		return localStorageWin ?? TURNS.P1;
	});

	const [board, setBoard] = useState(() => {
		const localStorageBoard = window.localStorage.getItem('board');
		if (localStorageBoard) return JSON.parse(localStorageBoard);
		return Array(9).fill(null);
	});

	const [winner, setWinner] = useState(() => {
		const localStorageWinner = window.localStorage.getItem('winner');
		return localStorageWinner ?? null;
	});

	function checkWinner(newBoard) {
		for (const possibleWin of POSSIBLEWINS) {
			const [a, b, c] = possibleWin;
			if (
				newBoard[a] &&
				newBoard[a] === newBoard[b] &&
				newBoard[a] === newBoard[c]
			) {
				return newBoard[a];
			}
		}
		return null;
	}

	function checkDraw(newBoard) {
		return newBoard.every((square) => square !== null);
	}

	const NullSpacesIndex = (newBoard) => {
		const newList = [];
		for (let i = 0; i < newBoard.length; i++) {
			if (newBoard[i] === null) {
				newList.push(i);
			}
		}
		return newList;
	};

	const get_random = (list) => {
		return list[Math.floor(Math.random() * list.length)];
	};

	const AiTurn = (newBoard) => {
		const emptySpaces = NullSpacesIndex(newBoard);
		let Moves = [];

		// Scoring each possible move
		for (let i = 0; i < emptySpaces.length; i++) {
			let score = 0;
			newBoard[emptySpaces[i]] = TURNS.P2;
			if (checkWinner(newBoard) == TURNS.P2) {
				score += 20;
			} else {
				if (checkDraw(newBoard)) {
					score += 10;
				} else {
					const otherSpaces = NullSpacesIndex(newBoard);
					for (let i = 0; i < otherSpaces.length; i++) {
						newBoard[otherSpaces[i]] = TURNS.P1;
						if (checkWinner(newBoard) == TURNS.P1) {
							score -= 20;
						}
						newBoard[otherSpaces[i]] = null;
					}
				}
			}

			Moves.push({ move: emptySpaces[i], score: score });
			newBoard[emptySpaces[i]] = null;
		}

		// Evaluating the best move
		let bestMoves = [];
		let currentScore = 0;
		let LastScore = -1000;
		for (let i = 0; i < emptySpaces.length; i++) {
			currentScore = Moves[i].score;
			if (currentScore > LastScore) {
				LastScore = currentScore;
				bestMoves = [Moves[i].move];
			} else if (currentScore == LastScore) {
				bestMoves.push(Moves[i].move);
			}
		}
		return get_random(bestMoves);
	};

	function updateBoard(index) {
		// check if square is empty
		if (board[index]) return;
		if (mode == 1) {
			if (turn == TURNS.P2) {
				return;
			}
		}

		// Decide the next player to play
		const newTurn = turn === TURNS.P1 ? TURNS.P2 : TURNS.P1;
		setTurn(newTurn);

		const newBoard = [...board];
		newBoard[index] = turn;
		setBoard(newBoard);

		const newWinner = checkWinner(newBoard);

		if (newWinner) {
			confetti();
			setWinner(newWinner);
			return;
		} else if (checkDraw(newBoard)) {
			setWinner(false);
			return;
		}

		// AI Move
		if (mode == 1) {
			setTimeout(() => {
				newBoard[AiTurn(newBoard)] = TURNS.P2;
				setBoard(newBoard);
				setTurn(TURNS.P1);
				if (checkWinner(newBoard)) {
					confetti();
					setWinner(checkWinner(newBoard));
					return;
				} else if (checkDraw(newBoard)) {
					setWinner(false);
					return;
				}
			}, 500);
		}

		window.localStorage.setItem('board', JSON.stringify(newBoard));
		window.localStorage.setItem('turn', newTurn);
	}

	const restartBoard = () => {
		setTurn(TURNS.P1);
		setBoard(Array(9).fill(null));
		setWinner(null);

		window.localStorage.clear();
	};

	return (
		<div className={styles.game_container}>
			<div className={styles.player_mode}>
				<span className={mode == 1 ? styles.N1 : styles.N2}></span>
				<button
					onClick={() => {
						setMode(1), restartBoard();
					}}
					className={mode == 1 ? styles.on : ''}
				>
					1P
				</button>
				<button
					onClick={() => {
						setMode(2), restartBoard();
					}}
					className={mode == 2 ? styles.on : ''}
				>
					2P
				</button>
			</div>
			<WinnerModal
				styles={styles}
				restartBoard={restartBoard}
				winner={winner}
			/>
			<h1>TIC TAC TOE</h1>
			<div className={styles.game_grid}>
				{board.map((el, i) => {
					return (
						<Square key={i} index={i} updateBoard={updateBoard} styles={styles}>
							{el}
						</Square>
					);
				})}
			</div>
			<h2>Turn of </h2>
			<div className={styles.turns}>
				<span className={turn === TURNS.P1 ? styles.selected : ''}>
					{TURNS.P1}
				</span>
				<span className={turn === TURNS.P2 ? styles.selected : ''}>
					{TURNS.P2}
				</span>
			</div>
			<button className={styles.resetButton} onClick={restartBoard}>
				Restart
			</button>
		</div>
	);
};

export default Board;
