import React, { useState, useEffect } from 'react';

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
  const [subGameWinner, setSubGameWinner] = useState<Player>(null);

  const checkWinner = (board: BoardState): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const isBoardFull = (board: BoardState): boolean => {
    return board.every(cell => cell !== null);
  };

  const canWinOrTie = (board: BoardState): boolean => {
    if (checkWinner(board)) return true;
    
    // Check if there's any line where a player can still win
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      const lineValues = [board[a], board[b], board[c]];
      if (!lineValues.includes('X') || !lineValues.includes('O')) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (!subGameWinner && !canWinOrTie(board)) {
      setSubGameWinner('Tie');
      onWin('Tie');
    }
  }, [board, subGameWinner]);

  const handleClick = (index: number) => {
    if (board[index] || subGameWinner || disabled) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setSubGameWinner(winner);
      onWin(winner);
    } else if (isBoardFull(newBoard) || !canWinOrTie(newBoard)) {
      setSubGameWinner('Tie');
      onWin('Tie');
    } else {
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
          disabled={!!cell || !!subGameWinner || disabled}
        >
          {cell}
        </button>
      ))}
      {subGameWinner === 'Tie' && <div className="tie-overlay">Tie</div>}
    </div>
  );
};

export default SubGame;