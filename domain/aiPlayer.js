import { BLACK, GAME_STATUS, PIECE_TYPES, WHITE } from "./constants";
import { applyMoveToGameState, getLegalMovesForColor } from "./gameState";

const PIECE_VALUES = {
    [PIECE_TYPES.PAWN]: 100,
    [PIECE_TYPES.KNIGHT]: 320,
    [PIECE_TYPES.BISHOP]: 330,
    [PIECE_TYPES.ROOK]: 500,
    [PIECE_TYPES.QUEEN]: 900,
    [PIECE_TYPES.KING]: 20000,
};

const WIN_SCORE = 1_000_000;

const DIFFICULTY_PRESETS = {
    beginner: {
        depth: 1,
        randomness: 0.45,
    },
    easy: {
        depth: 2,
        randomness: 0.22,
    },
    medium: {
        depth: 3,
        randomness: 0.1,
    },
    hard: {
        depth: 4,
        randomness: 0,
    },
};

export const AI_DIFFICULTY_OPTIONS = [
    { value: "beginner", label: "Beginner (Depth 1)" },
    { value: "easy", label: "Easy (Depth 2)" },
    { value: "medium", label: "Medium (Depth 3)" },
    { value: "hard", label: "Hard (Depth 4)" },
];

export const DEFAULT_AI_DIFFICULTY = "medium";

function getOpponentColor(color) {
    return color === WHITE ? BLACK : WHITE;
}

function evaluateMaterial(board, perspectiveColor) {
    let score = 0;

    for (let rank = 0; rank < 8; rank += 1) {
        for (let file = 0; file < 8; file += 1) {
            const piece = board[rank][file];
            if (!piece) {
                continue;
            }

            const value = PIECE_VALUES[piece.type] ?? 0;
            score += piece.color === perspectiveColor ? value : -value;
        }
    }

    return score;
}

function evaluateTerminalState(state, perspectiveColor) {
    if (state.status === GAME_STATUS.CHECKMATE) {
        if (state.winner === perspectiveColor) {
            return WIN_SCORE;
        }

        if (state.winner && state.winner !== perspectiveColor) {
            return -WIN_SCORE;
        }
    }

    if (state.status === GAME_STATUS.STALEMATE) {
        return 0;
    }

    return null;
}

function evaluateState(state, perspectiveColor) {
    const terminalScore = evaluateTerminalState(state, perspectiveColor);
    if (terminalScore !== null) {
        return terminalScore;
    }

    const materialScore = evaluateMaterial(state.board, perspectiveColor);
    const ownMoves = getLegalMovesForColor(state, perspectiveColor).length;
    const opponentMoves = getLegalMovesForColor(
        state,
        getOpponentColor(perspectiveColor)
    ).length;

    const mobilityScore = (ownMoves - opponentMoves) * 5;

    return materialScore + mobilityScore;
}

function minimax(state, depth, alpha, beta, maximizingPlayer, perspectiveColor) {
    const terminalScore = evaluateTerminalState(state, perspectiveColor);
    if (terminalScore !== null) {
        return terminalScore;
    }

    if (depth === 0) {
        return evaluateState(state, perspectiveColor);
    }

    const legalMoves = getLegalMovesForColor(state, state.turn);
    if (legalMoves.length === 0) {
        return evaluateState(state, perspectiveColor);
    }

    if (maximizingPlayer) {
        let bestScore = -Infinity;

        for (const move of legalMoves) {
            const nextState = applyMoveToGameState(state, move);
            const score = minimax(
                nextState,
                depth - 1,
                alpha,
                beta,
                false,
                perspectiveColor
            );

            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);

            if (beta <= alpha) {
                break;
            }
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const move of legalMoves) {
        const nextState = applyMoveToGameState(state, move);
        const score = minimax(
            nextState,
            depth - 1,
            alpha,
            beta,
            true,
            perspectiveColor
        );

        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);

        if (beta <= alpha) {
            break;
        }
    }

    return bestScore;
}

function getPreset(difficulty) {
    return DIFFICULTY_PRESETS[difficulty] ?? DIFFICULTY_PRESETS[DEFAULT_AI_DIFFICULTY];
}

function pickBeginnerMove(candidates, fallbackMove, randomness) {
    if (candidates.length === 0) {
        return fallbackMove;
    }

    if (Math.random() < randomness) {
        return candidates[Math.floor(Math.random() * candidates.length)].move;
    }

    return fallbackMove;
}

export function chooseAIMove(state, options = {}) {
    const difficulty = options.difficulty ?? DEFAULT_AI_DIFFICULTY;
    const aiColor = options.color ?? BLACK;

    if (state.turn !== aiColor) {
        return null;
    }

    const legalMoves = getLegalMovesForColor(state, aiColor);
    if (legalMoves.length === 0) {
        return null;
    }

    const preset = getPreset(difficulty);

    let bestMove = legalMoves[0];
    let bestScore = -Infinity;
    const scoredMoves = [];

    for (const move of legalMoves) {
        const nextState = applyMoveToGameState(state, move);
        const score = minimax(
            nextState,
            Math.max(0, preset.depth - 1),
            -Infinity,
            Infinity,
            false,
            aiColor
        );

        scoredMoves.push({ move, score });

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    console.log(scoredMoves);

    const topMoves = scoredMoves
        .filter((entry) => entry.score >= bestScore - 40)
        .sort((a, b) => b.score - a.score);

    return pickBeginnerMove(topMoves, bestMove, preset.randomness);
}
