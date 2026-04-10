import Piece from "./Piece";

export default function Square({
    piece,
    isDark,
    isSelected,
    isTarget,
    isLastMove,
    isCheckedKing,
    leftLabel,
    bottomLabel,
    onClick,
}) {
    const classNames = ["square", isDark ? "square-dark" : "square-light"];

    if (isSelected) {
        classNames.push("square-selected");
    }
    if (isTarget) {
        classNames.push("square-target");
    }
    if (isLastMove) {
        classNames.push("square-last-move");
    }
    if (isCheckedKing) {
        classNames.push("square-checked-king");
    }

    return (
        <button type="button" className={classNames.join(" ")} onClick={onClick}>
            {leftLabel ? <span className="coord-left">{leftLabel}</span> : null}
            {bottomLabel ? <span className="coord-bottom">{bottomLabel}</span> : null}
            {piece ? <Piece piece={piece} /> : null}
            {isTarget ? <span className="target-dot" /> : null}
        </button>
    );
}
