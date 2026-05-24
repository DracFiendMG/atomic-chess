import { useEffect, useMemo, useState } from "react";
import { BLACK, GAME_STATUS } from "../domain/constants";
import { toSquareKey } from "../domain/coords";
import { findKing } from "../domain/endConditions";
import {
    AI_DIFFICULTY_OPTIONS,
    DEFAULT_AI_DIFFICULTY,
    chooseAIMove,
} from "../domain/aiPlayer";
import {
    applyMoveToGameState,
    createInitialGameState,
    getLegalMovesForColor,
} from "../domain/gameState";

const AI_COLOR = BLACK;
const AI_MOVE_DELAY_MS = 260;
const EXPLOSION_DURATION_MS = 520;

export function useAtomicChess() {
    const [gameState, setGameState] = useState(() => createInitialGameState());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [aiEnabled, setAiEnabled] = useState(true);
    const [aiDifficulty, setAiDifficulty] = useState(DEFAULT_AI_DIFFICULTY);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [explosionSquareKeys, setExplosionSquareKeys] = useState(() => new Set());

    const legalMoves = useMemo(
        () => getLegalMovesForColor(gameState, gameState.turn),
        [gameState]
    );

    const isGameOver =
        gameState.status === GAME_STATUS.CHECKMATE ||
        gameState.status === GAME_STATUS.STALEMATE;
    const isAiTurn = aiEnabled && gameState.turn === AI_COLOR && !isGameOver;

    useEffect(() => {
        if (!isAiTurn) {
            setIsAiThinking(false);
            return;
        }

        setIsAiThinking(true);
        const timerId = window.setTimeout(() => {
            setGameState((prevState) => {
                const prevGameOver =
                    prevState.status === GAME_STATUS.CHECKMATE ||
                    prevState.status === GAME_STATUS.STALEMATE;
                if (!aiEnabled || prevState.turn !== AI_COLOR || prevGameOver) {
                    return prevState;
                }

                const aiMove = chooseAIMove(prevState, {
                    difficulty: aiDifficulty,
                    color: AI_COLOR,
                });

                if (!aiMove) {
                    return prevState;
                }

                return applyMoveToGameState(prevState, aiMove);
            });

            setIsAiThinking(false);
            setSelectedSquare(null);
        }, AI_MOVE_DELAY_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [aiDifficulty, aiEnabled, isAiTurn]);

    useEffect(() => {
        if (!gameState.lastMove?.flags?.isExplosion) {
            setExplosionSquareKeys(new Set());
            return;
        }

        const squares = gameState.lastMove.explodedSquares ?? [];
        if (squares.length === 0) {
            setExplosionSquareKeys(new Set());
            return;
        }

        const nextKeys = new Set(
            squares.map((square) => toSquareKey(square.file, square.rank))
        );
        setExplosionSquareKeys(nextKeys);

        const timerId = window.setTimeout(() => {
            setExplosionSquareKeys(new Set());
        }, EXPLOSION_DURATION_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [gameState.lastMove]);

    const selectedMoves = useMemo(() => {
        if (!selectedSquare) {
            return [];
        }

        return legalMoves.filter(
            (move) =>
                move.from.file === selectedSquare.file &&
                move.from.rank === selectedSquare.rank
        );
    }, [legalMoves, selectedSquare]);

    const targetSquareKeys = useMemo(() => {
        const keys = new Set();
        for (const move of selectedMoves) {
            keys.add(toSquareKey(move.to.file, move.to.rank));
        }

        return keys;
    }, [selectedMoves]);

    const checkedKingSquare = useMemo(() => {
        if (
            gameState.status !== GAME_STATUS.CHECK &&
            gameState.status !== GAME_STATUS.CHECKMATE
        ) {
            return null;
        }

        return findKing(gameState.board, gameState.turn);
    }, [gameState.board, gameState.status, gameState.turn]);

    function handleSquareClick(file, rank) {
        if (
            gameState.status === GAME_STATUS.CHECKMATE ||
            gameState.status === GAME_STATUS.STALEMATE
        ) {
            return;
        }

        if (isAiThinking || (aiEnabled && gameState.turn === AI_COLOR)) {
            return;
        }

        const clickedPiece = gameState.board[rank][file];
        const clickedOwnPiece =
            clickedPiece && clickedPiece.color === gameState.turn;

        if (selectedSquare) {
            const chosenMove = selectedMoves.find(
                (move) => move.to.file === file && move.to.rank === rank
            );

            if (chosenMove) {
                setGameState((prevState) =>
                    applyMoveToGameState(prevState, chosenMove)
                );
                setSelectedSquare(null);
                return;
            }

            if (clickedOwnPiece) {
                setSelectedSquare({ file, rank });
                return;
            }

            setSelectedSquare(null);
            return;
        }

        if (clickedOwnPiece) {
            setSelectedSquare({ file, rank });
        }
    }

    function restartGame() {
        setGameState(createInitialGameState());
        setSelectedSquare(null);
        setIsAiThinking(false);
        setExplosionSquareKeys(new Set());
    }

    function handleAiEnabledChange(nextValue) {
        setAiEnabled(nextValue);
        setSelectedSquare(null);
    }

    function handleAiDifficultyChange(nextDifficulty) {
        setAiDifficulty(nextDifficulty);
    }

    return {
        board: gameState.board,
        turn: gameState.turn,
        status: gameState.status,
        winner: gameState.winner,
        moveHistory: gameState.moveHistory,
        lastMove: gameState.lastMove,
        selectedSquare,
        targetSquareKeys,
        explosionSquareKeys,
        checkedKingSquare,
        legalMovesCount: legalMoves.length,
        aiEnabled,
        aiDifficulty,
        aiDifficultyOptions: AI_DIFFICULTY_OPTIONS,
        aiColor: AI_COLOR,
        isAiThinking,
        onSquareClick: handleSquareClick,
        onRestart: restartGame,
        onAiEnabledChange: handleAiEnabledChange,
        onAiDifficultyChange: handleAiDifficultyChange,
    };
}
