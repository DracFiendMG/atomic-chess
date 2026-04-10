function pairMoves(moveHistory) {
    const paired = [];

    for (let index = 0; index < moveHistory.length; index += 2) {
        paired.push({
            moveNumber: Math.floor(index / 2) + 1,
            white: moveHistory[index] ?? null,
            black: moveHistory[index + 1] ?? null,
        });
    }

    return paired;
}

export default function MoveList({ moveHistory }) {
    const rows = pairMoves(moveHistory);

    if (rows.length === 0) {
        return <p className="empty-history">No moves yet.</p>;
    }

    return (
        <div className="move-list-wrap">
            <table className="move-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>White</th>
                        <th>Black</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.moveNumber}>
                            <td>{row.moveNumber}</td>
                            <td>{row.white ? row.white.notation : ""}</td>
                            <td>{row.black ? row.black.notation : ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
