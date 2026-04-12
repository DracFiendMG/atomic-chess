import { applyMoveOnBoard } from "./atomicRules";
import { createInitialBoard, getPiece, resetPieceIdCounter } from "./board";
import { BLACK, GAME_STATUS, PIECE_TYPES, WHITE } from "./constants";
import { isKingAlive, isKingInCheck } from "./endConditions";
import { getPseudoLegalMovesForColor } from "./moveGenerator";
import { toMoveNotation } from "./notation";

function movesMatch(a, b) {
    return (
        a.pieceId === b.pieceId &&
        a.from.file === b.from.file &&
        a.from.rank === b.from.rank &&
        a.to.file === b.to.file &&
        a.to.rank === b.to.rank &&
        (a.promotionType ?? null) === (b.promotionType ?? null)
    );
}

export function createInitialGameState() {
    resetPieceIdCounter();

    return {
        board: createInitialBoard(),
        turn: WHITE,
        status: GAME_STATUS.ACTIVE,
        winner: null,
        moveHistory: [],
        halfMoveClock: 0,
        fullMoveNumber: 1,
        lastMove: null,
    };
}

export function getLegalMovesForColor(state, color) {
    const pseudoMoves = getPseudoLegalMovesForColor(state.board, color);

    return pseudoMoves.filter((candidateMove) => {
        const simulation = applyMoveOnBoard(state.board, candidateMove);

        // Checks whether the king is still present on the board.
        if (!isKingAlive(simulation.board, color)) {
            return false;
        }

        // Checks whether the move would put the king at an attacked square.
        // If the square is attacked, the move is illegal, even if the king is not currently in check.
        return !isKingInCheck(simulation.board, color);
    });
}

function resolveLegalMove(state, requestedMove) {
    const legalMoves = getLegalMovesForColor(state, state.turn);
    return legalMoves.find((move) => movesMatch(move, requestedMove)) ?? null;
}

export function applyMoveToGameState(state, requestedMove) {
    const legalMove = resolveLegalMove(state, requestedMove);
    if (!legalMove) {
        return state;
    }

    const movingPieceBefore = getPiece(state.board, legalMove.from.file, legalMove.from.rank);
    const moveResult = applyMoveOnBoard(state.board, legalMove);
    const nextTurn = state.turn === WHITE ? BLACK : WHITE;

    const wasCapture = Boolean(moveResult.capturedPiece);
    const moveRecord = {
        from: legalMove.from,
        to: legalMove.to,
        movingPieceId: legalMove.pieceId,
        capturePieceId: moveResult.capturedPiece ? moveResult.capturedPiece.id : null,
        promotionType: legalMove.promotionType,
        explodedPieceIds: moveResult.explodedPieceIds,
        notation: toMoveNotation(legalMove, wasCapture),
        flags: {
            isCapture: wasCapture,
            isExplosion: moveResult.explodedPieceIds.length > 0,
            isCheck: false,
            isCheckmate: false,
            isStalemate: false,
        },
    };

    const nextHalfMoveClock =
        wasCapture || movingPieceBefore?.type === PIECE_TYPES.PAWN
            ? 0
            : state.halfMoveClock + 1;

    let nextStatus = GAME_STATUS.ACTIVE;
    let nextWinner = null;

    const opponentKingAlive = isKingAlive(moveResult.board, nextTurn);
    if (!opponentKingAlive) {
        nextStatus = GAME_STATUS.CHECKMATE;
        nextWinner = state.turn;
        moveRecord.flags.isCheckmate = true;
    } else {
        const opponentInCheck = isKingInCheck(moveResult.board, nextTurn);
        const opponentLegalMoves = getLegalMovesForColor(
            {
                ...state,
                board: moveResult.board,
            },
            nextTurn
        );

        if (opponentLegalMoves.length === 0) {
            if (opponentInCheck) {
                nextStatus = GAME_STATUS.CHECKMATE;
                nextWinner = state.turn;
                moveRecord.flags.isCheckmate = true;
            } else {
                nextStatus = GAME_STATUS.STALEMATE;
                moveRecord.flags.isStalemate = true;
            }
        } else if (opponentInCheck) {
            nextStatus = GAME_STATUS.CHECK;
            moveRecord.flags.isCheck = true;
        }
    }

    return {
        board: moveResult.board,
        turn: nextTurn,
        status: nextStatus,
        winner: nextWinner,
        moveHistory: [...state.moveHistory, moveRecord],
        halfMoveClock: nextHalfMoveClock,
        fullMoveNumber: state.fullMoveNumber + (state.turn === BLACK ? 1 : 0),
        lastMove: moveRecord,
    };
}
