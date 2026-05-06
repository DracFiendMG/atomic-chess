export default function Piece({ piece }) {
    const weightClass = "fa-solid";
    const iconClass = `fa-chess-${piece.type}`;

    return (
        <span className={`piece piece-${piece.color}`} aria-label={`${piece.color} ${piece.type}`}>
            <i className={`${weightClass} ${iconClass} piece-icon`} aria-hidden="true" />
        </span>
    );
}
