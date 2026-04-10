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
        checkedKingSquare,
        legalMovesCount,
        onSquareClick,
        onRestart,
    } = useAtomicChess();

    return (
        <main className="app-shell">
            <section className="board-section">
                <Board
                    board={board}
                    selectedSquare={selectedSquare}
                    targetSquareKeys={targetSquareKeys}
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
                onRestart={onRestart}
            />
        </main>
    );
}