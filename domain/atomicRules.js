import { KINGS_IMMUNE_TO_EXPLOSION, PIECE_TYPES } from "./constants";
import { cloneBoard, getPiece, setPiece } from "./board";
import { inBounds } from "./coords";

const EXPLOSION_OFFSETS = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [0, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
];

function removeIfExplodable(board, file, rank, removedIds) {
    const piece = getPiece(board, file, rank);
    if (!piece) {
        return;
    }

    if (KINGS_IMMUNE_TO_EXPLOSION && piece.type === PIECE_TYPES.KING) {
        return;
    }

    removedIds.push(piece.id);
    setPiece(board, file, rank, null);
}

export function applyMoveOnBoard(board, move) {
    const nextBoard = cloneBoard(board);
    const movingPiece = getPiece(nextBoard, move.from.file, move.from.rank);
    if (!movingPiece) {
        return { board: nextBoard, capturedPiece: null, explodedPieceIds: [] };
    }

    const targetPiece = getPiece(nextBoard, move.to.file, move.to.rank);
    const isCapture = Boolean(targetPiece);

    setPiece(nextBoard, move.from.file, move.from.rank, null);

    const movedPiece = {
        ...movingPiece,
        hasMoved: true,
        type: move.promotionType ?? movingPiece.type,
    };
    setPiece(nextBoard, move.to.file, move.to.rank, movedPiece);

    const explodedPieceIds = [];

    if (isCapture) {
        explodedPieceIds.push(targetPiece.id);

        for (const [fileOffset, rankOffset] of EXPLOSION_OFFSETS) {
            const file = move.to.file + fileOffset;
            const rank = move.to.rank + rankOffset;
            if (!inBounds(file, rank)) {
                continue;
            }

            removeIfExplodable(nextBoard, file, rank, explodedPieceIds);
        }
    }

    return {
        board: nextBoard,
        capturedPiece: targetPiece,
        explodedPieceIds,
    };
}
