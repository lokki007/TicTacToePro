import React, { useState, useEffect } from 'react';
import SubGame from './SubGame';

type Player = 'X' | 'O' | 'Tie' | null;
type BoardState = (Player | null)[];

interface ScoreBoard {
  [key: string]: number;
  Tie: number;
}

interface GameResult {
  winner: string;
  date: string;
}

const StackedTicTacToe: React.FC = () => {
  const [mainBoard, setMainBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [scoreBoard, setScoreBoard] = useState<ScoreBoard>({ Player1: 0, Player2: 0, Tie: 0 });
  const [playerNames, setPlayerNames] = useState<{Player1: string, Player2: string}>({ Player1: '', Player2: '' });
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [player1IsX, setPlayer1IsX] = useState(true);

  const handleSubGameWin = (index: number, result: Player) => {
    const newMainBoard = [...mainBoard];
    newMainBoard[index] = result;
    setMainBoard(newMainBoard);
  };

  const handleMove = () => {
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

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
      if (board[a] && board[a] !== 'Tie' && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const isMainBoardFull = (board: BoardState): boolean => {
    return board.every(cell => cell !== null);
  };

  const canWinOrTie = (board: BoardState): boolean => {
    if (checkWinner(board)) return true;
    
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
      if (!lineValues.includes('X') && !lineValues.includes('O')) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    const gameWinner = checkWinner(mainBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      const winningPlayer = gameWinner === 'X' ? (player1IsX ? 'Player1' : 'Player2') : (player1IsX ? 'Player2' : 'Player1');
      setScoreBoard(prev => ({ ...prev, [winningPlayer]: prev[winningPlayer] + 1 }));
      setGameResults(prev => [...prev, { winner: playerNames[winningPlayer], date: new Date().toLocaleString() }]);
    } else if (isMainBoardFull(mainBoard) || !canWinOrTie(mainBoard)) {
      setWinner('Tie');
      setScoreBoard(prev => ({ ...prev, Tie: prev.Tie + 1 }));
      setGameResults(prev => [...prev, { winner: 'Tie', date: new Date().toLocaleString() }]);
    }
  }, [mainBoard]);

  const resetGame = () => {
    setMainBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setPlayer1IsX(!player1IsX); // Rotate X and O between players
  };

  const startGame = () => {
    if (playerNames.Player1 && playerNames.Player2) {
      setGameStarted(true);
      resetGame();
    } else {
      alert("Please enter names for both players!");
    }
  };

  if (!gameStarted) {
    return (
      <div className="player-setup">
        <h1>Stacked Tic-Tac-Toe</h1>
        <input 
          type="text" 
          placeholder="Player 1 Name" 
          value={playerNames.Player1} 
          onChange={(e) => setPlayerNames(prev => ({ ...prev, Player1: e.target.value }))}
        />
        <input 
          type="text" 
          placeholder="Player 2 Name" 
          value={playerNames.Player2} 
          onChange={(e) => setPlayerNames(prev => ({ ...prev, Player2: e.target.value }))}
        />
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }

  const currentPlayerName = currentPlayer === 'X' ? 
    (player1IsX ? playerNames.Player1 : playerNames.Player2) : 
    (player1IsX ? playerNames.Player2 : playerNames.Player1);

  return (
    <div className="stacked-tictactoe">
      <h1>Stacked Tic-Tac-Toe</h1>
      <div className="scoreboard">
        <div>{playerNames.Player1}: {scoreBoard.Player1}</div>
        <div>{playerNames.Player2}: {scoreBoard.Player2}</div>
        <div>Ties: {scoreBoard.Tie}</div>
      </div>
      <div className="main-board">
        {mainBoard.map((cell, index) => (
          <div key={index} className="sub-game">
            {cell ? (
              <div className={`winner ${cell === 'Tie' ? 'tie' : ''}`}>{cell}</div>
            ) : (
              <SubGame
                onWin={(subWinner) => handleSubGameWin(index, subWinner)}
                onMove={handleMove}
                currentPlayer={currentPlayer}
                disabled={!!winner}
              />
            )}
          </div>
        ))}
      </div>
      {winner && <h2>Game Result: {winner === 'Tie' ? 'Tie Game' : `Winner: ${currentPlayerName}`}</h2>}
      <p>Current Player: {currentPlayerName} ({currentPlayer})</p>
      <button onClick={resetGame} className="reset-button">New Game</button>
      <div className="results-table">
        <h3>Game Results</h3>
        <table>
          <thead>
            <tr>
              <th>Winner</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {gameResults.map((result, index) => (
              <tr key={index}>
                <td>{result.winner}</td>
                <td>{result.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StackedTicTacToe;