import React, { useState } from 'react';

type Player = 'X' | 'O' | 'Tie' | null;
type BoardState = Player[];

interface SubGameProps {
  onWin: (winner: Player) => void;
  onMove: () => void;
  currentPlayer: 'X' | 'O';
  disabled: boolean;
}

const SubGame: React.FC<SubGameProps> = ({ onWin, onMove, currentPlayer, disabled }) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));

  const checkWinner = (board: BoardState): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        console.log(`Winner found in SubGame: ${board[a]}`);
        return board[a];
      }
    }

    return null;
  };

  const isTie = (board: BoardState): boolean => {
    // Check if the board is full
    if (board.every((cell) => cell !== null)) {
      console.log("SubGame board is full, it's a tie");
      return true;
    }

    // Check if there's any possibility of winning for either player
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      const lineValues = [board[a], board[b], board[c]];
      if (!lineValues.includes('X') || !lineValues.includes('O')) {
        // This line still has a chance of winning for either player
        return false;
      }
    }

    console.log("SubGame is a tie: no possible wins for either player");
    return true;
  };

  const handleClick = (index: number) => {
    if (board[index] || disabled) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    console.log(`SubGame move: ${currentPlayer} at index ${index}`);
    console.log("New SubGame board state:", newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      console.log(`SubGame winner: ${winner}`);
      onWin(winner);
    } else if (isTie(newBoard)) {
      console.log("SubGame tie detected");
      onWin('Tie');
    } else {
      console.log("SubGame continues");
      onMove();
    }
  };

  return (
    <div className="sub-board">
      {board.map((cell, index) => (
        <button
          key={index}
          className="cell"
          onClick={() => handleClick(index)}
          disabled={!!cell || disabled}
        >
          {cell && (
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              {cell === 'X' ? (
                <path d="M15 15L45 45M45 15L15 45" stroke="#FFFF00" strokeWidth="8" strokeLinecap="round"/>
              ) : (
                <circle cx="30" cy="30" r="20" stroke="#FFFF00" strokeWidth="8"/>
              )}
            </svg>
          )}
        </button>
      ))}
    </div>
  );
};

export default SubGame;