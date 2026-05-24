import Board from "./components/Board";
import GamePanel from "./components/GamePanel";
import { useAtomicChess } from "./hooks/useAtomicChess";

export default function App() {
    const {
        board,
        turn,
        status,
        winner,
        moveHistory,
        lastMove,
        selectedSquare,
        targetSquareKeys,
        explosionSquareKeys,
        checkedKingSquare,
        legalMovesCount,
        aiEnabled,
        aiDifficulty,
        aiDifficultyOptions,
        aiColor,
        isAiThinking,
        onSquareClick,
        onRestart,
        onAiEnabledChange,
        onAiDifficultyChange,
    } = useAtomicChess();

    return (
        <main className="app-shell">
            <section className="board-section">
                <Board
                    board={board}
                    selectedSquare={selectedSquare}
                    targetSquareKeys={targetSquareKeys}
                    explosionSquareKeys={explosionSquareKeys}
                    lastMove={lastMove}
                    checkedKingSquare={checkedKingSquare}
                    onSquareClick={onSquareClick}
                />
            </section>

            <GamePanel
                turn={turn}
                status={status}
                winner={winner}
                legalMovesCount={legalMovesCount}
                moveHistory={moveHistory}
                aiEnabled={aiEnabled}
                aiDifficulty={aiDifficulty}
                aiDifficultyOptions={aiDifficultyOptions}
                aiColor={aiColor}
                isAiThinking={isAiThinking}
                onRestart={onRestart}
                onAiEnabledChange={onAiEnabledChange}
                onAiDifficultyChange={onAiDifficultyChange}
            />
        </main>
    );
}