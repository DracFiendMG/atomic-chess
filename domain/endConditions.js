import { BLACK, PIECE_TYPES, WHITE } from "./constants";
import { getPiece } from "./board";
import { inBounds } from "./coords";

const KNIGHT_OFFSETS = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
];

const KING_OFFSETS = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
];

const BISHOP_DIRECTIONS = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
];

const ROOK_DIRECTIONS = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
];

export function findKing(board, color) {
    for (let rank = 0; rank < 8; rank += 1) {
        for (let file = 0; file < 8; file += 1) {
            const piece = getPiece(board, file, rank);
            if (piece && piece.color === color && piece.type === PIECE_TYPES.KING) {
                return { file, rank };
            }
        }
    }

    return null;
}

export function isKingAlive(board, color) {
    return Boolean(findKing(board, color));
}

function isAttackedByPawn(board, file, rank, attackerColor) {
    const direction = attackerColor === WHITE ? -1 : 1;
    const sourceRank = rank - direction;

    for (const fileOffset of [-1, 1]) {
        const sourceFile = file - fileOffset;
        if (!inBounds(sourceFile, sourceRank)) {
            continue;
        }

        const piece = getPiece(board, sourceFile, sourceRank);
        if (piece && piece.color === attackerColor && piece.type === PIECE_TYPES.PAWN) {
            return true;
        }
    }

    return false;
}

function isAttackedByKnight(board, file, rank, attackerColor) {
    return KNIGHT_OFFSETS.some(([fileOffset, rankOffset]) => {
        const sourceFile = file + fileOffset;
        const sourceRank = rank + rankOffset;
        if (!inBounds(sourceFile, sourceRank)) {
            return false;
        }

        const piece = getPiece(board, sourceFile, sourceRank);
        return piece && piece.color === attackerColor && piece.type === PIECE_TYPES.KNIGHT;
    });
}

function isAttackedByKing(board, file, rank, attackerColor) {
    return KING_OFFSETS.some(([fileOffset, rankOffset]) => {
        const sourceFile = file + fileOffset;
        const sourceRank = rank + rankOffset;
        if (!inBounds(sourceFile, sourceRank)) {
            return false;
        }

        const piece = getPiece(board, sourceFile, sourceRank);
        return piece && piece.color === attackerColor && piece.type === PIECE_TYPES.KING;
    });
}

function isAttackedBySlider(board, file, rank, attackerColor, directions, validTypes) {
    for (const [fileDirection, rankDirection] of directions) {
        let sourceFile = file + fileDirection;
        let sourceRank = rank + rankDirection;

        while (inBounds(sourceFile, sourceRank)) {
            const piece = getPiece(board, sourceFile, sourceRank);
            if (!piece) {
                sourceFile += fileDirection;
                sourceRank += rankDirection;
                continue;
            }

            if (piece.color === attackerColor && validTypes.includes(piece.type)) {
                return true;
            }

            break;
        }
    }

    return false;
}

export function isSquareAttacked(board, file, rank, attackerColor) {
    return (
        isAttackedByPawn(board, file, rank, attackerColor) ||
        isAttackedByKnight(board, file, rank, attackerColor) ||
        isAttackedByKing(board, file, rank, attackerColor) ||
        isAttackedBySlider(board, file, rank, attackerColor, BISHOP_DIRECTIONS, [
            PIECE_TYPES.BISHOP,
            PIECE_TYPES.QUEEN,
        ]) ||
        isAttackedBySlider(board, file, rank, attackerColor, ROOK_DIRECTIONS, [
            PIECE_TYPES.ROOK,
            PIECE_TYPES.QUEEN,
        ])
    );
}

export function isKingInCheck(board, color) {
    const kingSquare = findKing(board, color);
    if (!kingSquare) {
        return true;
    }

    const attackerColor = color === WHITE ? BLACK : WHITE;
    return isSquareAttacked(board, kingSquare.file, kingSquare.rank, attackerColor);
}
