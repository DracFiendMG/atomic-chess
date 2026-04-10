const PIECE_LABELS = {
    king: "K",
    queen: "Q",
    rook: "R",
    bishop: "B",
    knight: "N",
    pawn: "P",
};

export default function Piece({ piece }) {
    return (
        <span className={`piece piece-${piece.color}`} aria-label={`${piece.color} ${piece.type}`}>
            {PIECE_LABELS[piece.type]}
        </span>
    );
}
