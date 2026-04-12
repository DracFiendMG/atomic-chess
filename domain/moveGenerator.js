import { BLACK, PIECE_TYPES, PROMOTION_DEFAULT, WHITE } from "./constants";
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

function makeMove(piece, fromFile, fromRank, toFile, toRank, targetPiece, promotionType = null) {
    return {
        from: { file: fromFile, rank: fromRank },
        to: { file: toFile, rank: toRank },
        pieceId: piece.id,
        pieceType: piece.type,
        color: piece.color,
        capturePieceId: targetPiece ? targetPiece.id : null,
        promotionType,
    };
}

function isEnemy(piece, target) {
    return Boolean(target) && target.color !== piece.color;
}

function getEnemyKingSquare(board, color) {
    const targetColor = color === WHITE ? BLACK : WHITE;
    for (let rank = 0; rank < 8; rank += 1) {
        for (let file = 0; file < 8; file += 1) {
            const piece = getPiece(board, file, rank);
            if (piece && piece.color === targetColor && piece.type === PIECE_TYPES.KING) {
                return { file, rank };
            }
        }
    }

    return null;
}

function isKingAdjacentToEnemyKing(board, file, rank, color) {
    const enemyKingSquare = getEnemyKingSquare(board, color);
    if (!enemyKingSquare) {
        return false;
    }

    return (
        Math.abs(enemyKingSquare.file - file) <= 1 &&
        Math.abs(enemyKingSquare.rank - rank) <= 1
    );
}

function addSlidingMoves(moves, board, piece, file, rank, directions) {
    for (const [fileDirection, rankDirection] of directions) {
        let nextFile = file + fileDirection;
        let nextRank = rank + rankDirection;

        while (inBounds(nextFile, nextRank)) {
            const target = getPiece(board, nextFile, nextRank);
            if (!target) {
                moves.push(makeMove(piece, file, rank, nextFile, nextRank, null));
            } else {
                if (isEnemy(piece, target)) {
                    moves.push(makeMove(piece, file, rank, nextFile, nextRank, target));
                }
                break;
            }

            nextFile += fileDirection;
            nextRank += rankDirection;
        }
    }
}

function getPawnMoves(board, piece, file, rank) {
    const moves = [];
    const direction = piece.color === WHITE ? -1 : 1;
    const startRank = piece.color === WHITE ? 6 : 1;
    const promotionRank = piece.color === WHITE ? 0 : 7;

    const oneStepRank = rank + direction;
    if (inBounds(file, oneStepRank) && !getPiece(board, file, oneStepRank)) {
        const promotionType = oneStepRank === promotionRank ? PROMOTION_DEFAULT : null;
        moves.push(makeMove(piece, file, rank, file, oneStepRank, null, promotionType));

        const twoStepRank = rank + direction * 2;
        if (rank === startRank && !getPiece(board, file, twoStepRank)) {
            moves.push(makeMove(piece, file, rank, file, twoStepRank, null));
        }
    }

    for (const fileOffset of [-1, 1]) {
        const captureFile = file + fileOffset;
        const captureRank = rank + direction;
        if (!inBounds(captureFile, captureRank)) {
            continue;
        }

        const target = getPiece(board, captureFile, captureRank);
        if (!isEnemy(piece, target)) {
            continue;
        }

        const promotionType = captureRank === promotionRank ? PROMOTION_DEFAULT : null;
        moves.push(
            makeMove(piece, file, rank, captureFile, captureRank, target, promotionType)
        );
    }

    return moves;
}

function getKnightMoves(board, piece, file, rank) {
    const moves = [];

    for (const [fileOffset, rankOffset] of KNIGHT_OFFSETS) {
        const toFile = file + fileOffset;
        const toRank = rank + rankOffset;
        if (!inBounds(toFile, toRank)) {
            continue;
        }

        const target = getPiece(board, toFile, toRank);
        if (!target || isEnemy(piece, target)) {
            moves.push(makeMove(piece, file, rank, toFile, toRank, target));
        }
    }

    return moves;
}

function getKingMoves(board, piece, file, rank) {
    const moves = [];

    for (const [fileOffset, rankOffset] of KING_OFFSETS) {
        const toFile = file + fileOffset;
        const toRank = rank + rankOffset;
        if (!inBounds(toFile, toRank)) {
            continue;
        }

        if (isKingAdjacentToEnemyKing(board, toFile, toRank, piece.color)) {
            continue;
        }

        const target = getPiece(board, toFile, toRank);
        
        // King cannot capture enemies
        if (!target || isEnemy(piece, target)) {
            moves.push(makeMove(piece, file, rank, toFile, toRank, target));
        }
    }

    return moves;
}

export function getPseudoMovesForPiece(board, file, rank) {
    const piece = getPiece(board, file, rank);
    if (!piece) {
        return [];
    }

    switch (piece.type) {
        case PIECE_TYPES.PAWN:
            return getPawnMoves(board, piece, file, rank);
        case PIECE_TYPES.KNIGHT:
            return getKnightMoves(board, piece, file, rank);
        case PIECE_TYPES.BISHOP: {
            const moves = [];
            addSlidingMoves(moves, board, piece, file, rank, BISHOP_DIRECTIONS);
            return moves;
        }
        case PIECE_TYPES.ROOK: {
            const moves = [];
            addSlidingMoves(moves, board, piece, file, rank, ROOK_DIRECTIONS);
            return moves;
        }
        case PIECE_TYPES.QUEEN: {
            const moves = [];
            addSlidingMoves(moves, board, piece, file, rank, [
                ...BISHOP_DIRECTIONS,
                ...ROOK_DIRECTIONS,
            ]);
            return moves;
        }
        case PIECE_TYPES.KING:
            return getKingMoves(board, piece, file, rank);
        default:
            return [];
    }
}

export function getPseudoLegalMovesForColor(board, color) {
    const moves = [];

    for (let rank = 0; rank < 8; rank += 1) {
        for (let file = 0; file < 8; file += 1) {
            const piece = getPiece(board, file, rank);
            if (!piece || piece.color !== color) {
                continue;
            }

            moves.push(...getPseudoMovesForPiece(board, file, rank));
        }
    }

    return moves;
}
