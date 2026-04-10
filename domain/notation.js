import { toAlgebraic } from "./coords";

export function toMoveNotation(move, wasCapture) {
    const from = toAlgebraic(move.from.file, move.from.rank);
    const to = toAlgebraic(move.to.file, move.to.rank);
    const separator = wasCapture ? "x" : "-";
    return `${from}${separator}${to}`;
}
