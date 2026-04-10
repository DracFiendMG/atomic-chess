import { GAME_STATUS } from "../domain/constants";
import MoveList from "./MoveList";

function toTitleCase(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStatusText(status, turn, winner, legalMovesCount) {
    if (status === GAME_STATUS.CHECKMATE) {
        return `${toTitleCase(winner)} wins by checkmate.`;
    }
    if (status === GAME_STATUS.STALEMATE) {
        return "Draw by stalemate.";
    }
    if (status === GAME_STATUS.CHECK) {
        return `${toTitleCase(turn)} to move - check.`;
    }
    return `${toTitleCase(turn)} to move - ${legalMovesCount} legal moves.`;
}

export default function GamePanel({
    turn,
    status,
    winner,
    legalMovesCount,
    moveHistory,
    onRestart,
}) {
    return (
        <aside className="game-panel">
            <h1>Atomic Chess</h1>
            <p className="status-line">{getStatusText(status, turn, winner, legalMovesCount)}</p>
            <button type="button" className="restart-button" onClick={onRestart}>
                Restart Game
            </button>
            <section className="history-section">
                <h2>Move History</h2>
                <MoveList moveHistory={moveHistory} />
            </section>
        </aside>
    );
}
