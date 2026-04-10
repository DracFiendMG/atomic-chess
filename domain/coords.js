import { BOARD_SIZE } from "./constants";

export function inBounds(file, rank) {
    return file >= 0 && file < BOARD_SIZE && rank >= 0 && rank < BOARD_SIZE;
}

export function toSquareKey(file, rank) {
    return `${file},${rank}`;
}

export function toAlgebraic(file, rank) {
    const fileChar = String.fromCharCode(97 + file);
    const rankChar = 8 - rank;
    return `${fileChar}${rankChar}`;
}

export function fromAlgebraic(square) {
    if (!/^[a-h][1-8]$/i.test(square)) {
        return null;
    }

    const file = square.toLowerCase().charCodeAt(0) - 97;
    const rank = 8 - Number(square[1]);
    return { file, rank };
}
