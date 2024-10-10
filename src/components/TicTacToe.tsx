import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const XIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 15L45 45M45 15L15 45" stroke="#FFFF00" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

const OIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="20" stroke="#FFFF00" strokeWidth="8"/>
  </svg>
);

function TicTacToe() {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState<string | null>(null);
    const player1 = "Cosmic Carl";
    const player2 = "Galactic Gary";

    const handleClick = (index: number) => {
        if (board[index] || winner) return;
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        checkWinner(newBoard);
    };

    const checkWinner = (board: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinner(board[a] === 'X' ? player1 : player2);
                return;
            }
        }
        if (board.every(cell => cell !== null)) {
            setWinner('Draw');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
    };

    return (
        <Box sx={{
            flexGrow: 1,
            padding: 4,
            bgcolor: 'rgba(10, 10, 42, 0.9)',
            borderRadius: 4,
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            maxWidth: 400,
            margin: 'auto',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#FFFF00', textShadow: '0 0 10px #FFFF00' }}>
                Cosmic Tic Tac Toe
            </Typography>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#FFFF00' }}>
                {currentPlayer === 'X' ? player1 : player2}'s Turn ({currentPlayer})
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {board.map((cell, index) => (
                    <Grid item xs={4} key={index}>
                        <motion.div
                            whileHover={{ scale: 1.1, rotateY: 10, rotateX: 10 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                    height: 100,
                                    borderRadius: 2,
                                    border: '2px solid rgba(255, 255, 0, 0.3)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 0, 0.1)',
                                        boxShadow: '0 0 15px #FFFF00',
                                    },
                                }}
                                onClick={() => handleClick(index)}
                                disabled={!!cell || !!winner}
                            >
                                {cell === 'X' && <XIcon />}
                                {cell === 'O' && <OIcon />}
                            </Button>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
            <AnimatePresence>
                {winner && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h5" align="center" sx={{ marginTop: 2, color: '#FFFF00', textShadow: '0 0 10px #FFFF00' }}>
                            {winner === 'Draw' ? "It's a Cosmic Draw!" : `${winner} conquers the galaxy!`}
                        </Typography>
                    </motion.div>
                )}
            </AnimatePresence>
            <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95, rotate: -5 }}
                >
                    <Button
                        variant="contained"
                        onClick={resetGame}
                        sx={{
                            paddingX: 4,
                            paddingY: 1,
                            fontSize: '1rem',
                            borderRadius: 2,
                            backgroundColor: '#FFFF00',
                            color: '#000',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#FFFF00',
                                boxShadow: '0 0 20px #FFFF00',
                            },
                        }}
                    >
                        Reset Universe
                    </Button>
                </motion.div>
            </Box>
        </Box>
    );
}

export default TicTacToe;