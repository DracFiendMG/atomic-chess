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
    aiEnabled,
    aiDifficulty,
    aiDifficultyOptions,
    aiColor,
    isAiThinking,
    onRestart,
    onAiEnabledChange,
    onAiDifficultyChange,
}) {
    return (
        <aside className="game-panel">
            <h1>Atomic Chess</h1>
            <p className="status-line">{getStatusText(status, turn, winner, legalMovesCount)}</p>

            <section className="ai-controls">
                <h2>Opponent</h2>
                <label className="ai-toggle">
                    <input
                        type="checkbox"
                        checked={aiEnabled}
                        onChange={(event) => onAiEnabledChange(event.target.checked)}
                    />
                    Play against AI ({toTitleCase(aiColor)})
                </label>

                <label className="ai-difficulty-label" htmlFor="ai-difficulty-select">
                    Difficulty
                </label>
                <select
                    id="ai-difficulty-select"
                    className="ai-difficulty-select"
                    value={aiDifficulty}
                    disabled={!aiEnabled || isAiThinking}
                    onChange={(event) => onAiDifficultyChange(event.target.value)}
                >
                    {aiDifficultyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <p className="ai-status-line">
                    {aiEnabled
                        ? isAiThinking
                            ? "AI is thinking..."
                            : `${toTitleCase(aiColor)} AI is ready.`
                        : "AI disabled: local two-player mode."}
                </p>
            </section>

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
