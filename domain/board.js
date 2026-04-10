import { BLACK, PIECE_TYPES, WHITE } from "./constants";
import { inBounds } from "./coords";

let nextPieceId = 1;

export function resetPieceIdCounter() {
    nextPieceId = 1;
}

export function createPiece(type, color) {
    const id = `${color[0]}-${type}-${nextPieceId++}`;
    return {
        id,
        type,
        color,
        hasMoved: false,
    };
}

export function createEmptyBoard() {
    return Array.from({ length: 8 }, () => Array(8).fill(null));
}

export function cloneBoard(board) {
    return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

export function getPiece(board, file, rank) {
    if (!inBounds(file, rank)) {
        return null;
    }

    return board[rank][file];
}

export function setPiece(board, file, rank, piece) {
    if (!inBounds(file, rank)) {
        return;
    }

    board[rank][file] = piece;
}

function setupBackRank(board, rank, color) {
    const order = [
        PIECE_TYPES.ROOK,
        PIECE_TYPES.KNIGHT,
        PIECE_TYPES.BISHOP,
        PIECE_TYPES.QUEEN,
        PIECE_TYPES.KING,
        PIECE_TYPES.BISHOP,
        PIECE_TYPES.KNIGHT,
        PIECE_TYPES.ROOK,
    ];

    order.forEach((type, file) => {
        setPiece(board, file, rank, createPiece(type, color));
    });
}

export function createInitialBoard() {
    const board = createEmptyBoard();

    setupBackRank(board, 0, BLACK);
    for (let file = 0; file < 8; file += 1) {
        setPiece(board, file, 1, createPiece(PIECE_TYPES.PAWN, BLACK));
    }

    for (let file = 0; file < 8; file += 1) {
        setPiece(board, file, 6, createPiece(PIECE_TYPES.PAWN, WHITE));
    }
    setupBackRank(board, 7, WHITE);

    return board;
}
