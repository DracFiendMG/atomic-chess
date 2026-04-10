import { useMemo, useState } from "react";
import { GAME_STATUS } from "../domain/constants";
import { toSquareKey } from "../domain/coords";
import { findKing } from "../domain/endConditions";
import {
    applyMoveToGameState,
    createInitialGameState,
    getLegalMovesForColor,
} from "../domain/gameState";

export function useAtomicChess() {
    const [gameState, setGameState] = useState(() => createInitialGameState());
    const [selectedSquare, setSelectedSquare] = useState(null);

    const legalMoves = useMemo(
        () => getLegalMovesForColor(gameState, gameState.turn),
        [gameState]
    );

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
        checkedKingSquare,
        legalMovesCount: legalMoves.length,
        onSquareClick: handleSquareClick,
        onRestart: restartGame,
    };
}
