import Square from "./Square";
import { toSquareKey } from "../domain/coords";

const FILE_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Board({
    board,
    selectedSquare,
    targetSquareKeys,
    explosionSquareKeys,
    lastMove,
    checkedKingSquare,
    onSquareClick,
}) {
    const squares = [];

    for (let rank = 0; rank < 8; rank += 1) {
        for (let file = 0; file < 8; file += 1) {
            const key = toSquareKey(file, rank);
            const piece = board[rank][file];
            const isDark = (file + rank) % 2 === 1;
            const isSelected =
                selectedSquare &&
                selectedSquare.file === file &&
                selectedSquare.rank === rank;
            const isTarget = targetSquareKeys.has(key);
            const isExplosion = explosionSquareKeys?.has(key);
            const isLastMove =
                Boolean(lastMove) &&
                ((lastMove.from.file === file && lastMove.from.rank === rank) ||
                    (lastMove.to.file === file && lastMove.to.rank === rank));
            const isCheckedKing =
                Boolean(checkedKingSquare) &&
                checkedKingSquare.file === file &&
                checkedKingSquare.rank === rank;

            squares.push(
                <Square
                    key={key}
                    piece={piece}
                    isDark={isDark}
                    isSelected={isSelected}
                    isTarget={isTarget}
                    isExplosion={isExplosion}
                    isLastMove={isLastMove}
                    isCheckedKing={isCheckedKing}
                    leftLabel={file === 0 ? String(8 - rank) : null}
                    bottomLabel={rank === 7 ? FILE_LABELS[file] : null}
                    onClick={() => onSquareClick(file, rank)}
                />
            );
        }
    }

    return <div className="board-grid">{squares}</div>;
}