# AI Player Documentation

This document explains how the Atomic Chess AI opponent works, how difficulty levels are implemented, and where to modify behavior.

## Overview

The AI opponent uses the Minimax algorithm with alpha-beta pruning.

- The AI plays as black by default.
- It evaluates legal moves from the current state.
- It simulates future turns up to a configurable search depth.
- It chooses the move with the best score for its color.

Implementation file:
- `domain/aiPlayer.js`

Integration points:
- `hooks/useAtomicChess.js` (AI turn scheduling and settings)
- `components/GamePanel.jsx` (difficulty and enable/disable controls)

## Difficulty Levels

Difficulty is controlled by two parameters:

1. Search depth
2. Randomness in top move selection

Current presets:

- Beginner
  - Depth: 1
  - Randomness: 0.45
- Easy
  - Depth: 2
  - Randomness: 0.22
- Medium
  - Depth: 3
  - Randomness: 0.10
- Hard
  - Depth: 4
  - Randomness: 0.00

The beginner setting intentionally makes occasional non-optimal choices to feel more human and less punishing.

## Evaluation Function

The AI scores positions from its own perspective (positive is good for AI, negative is good for opponent).

### Material values

- Pawn: 100
- Knight: 320
- Bishop: 330
- Rook: 500
- Queen: 900
- King: 20000

### Mobility bonus

In addition to material, the AI adds a mobility term:

- `(ownLegalMoves - opponentLegalMoves) * 5`

This encourages active positions and helps avoid cramped play.

### Terminal scoring

- AI checkmates opponent: `+1,000,000`
- AI gets checkmated: `-1,000,000`
- Stalemate: `0`

This ensures forced mates are prioritized over material gains.

## Minimax with Alpha-Beta

The AI uses recursive minimax search:

- Maximizing nodes: AI turn
- Minimizing nodes: opponent turn

Alpha-beta pruning is used to skip branches that cannot improve the result.

Benefits:

- Reduces number of explored nodes
- Supports higher depth for hard difficulty
- Keeps turn time responsive in browser play

## Move Selection Flow

At AI turn:

1. Get all legal moves for AI color.
2. For each move, simulate with `applyMoveToGameState`.
3. Evaluate resulting position via minimax.
4. Choose best move score.
5. For easier difficulties, optionally choose randomly among near-best moves.

## UI Controls

The game panel includes:

- Enable/disable AI toggle
- Difficulty dropdown
- Thinking status text

When AI is thinking:

- Human clicks are ignored for consistency.
- A short delay is used before move execution to improve UX readability.

## Performance Notes

- Depth 4 is computationally heavier than lower levels.
- Current implementation is synchronous and runs on main thread.
- If stronger levels are needed later, consider:
  - Move ordering heuristics
  - Transposition table (hash cache)
  - Iterative deepening
  - Web Worker offloading

## Extending the AI

Common changes:

- Update difficulty presets in `DIFFICULTY_PRESETS`.
- Tune piece values and mobility weight.
- Add positional heuristics (piece-square tables, king safety, passed pawns).
- Add opening move book for faster early-game play.

## Known Limitations

- No transposition caching yet.
- No quiescence search for tactical explosion-heavy positions.
- Evaluation is mostly material + mobility and may miss deeper strategic patterns.

These are expected trade-offs for maintainability and speed in a frontend-first implementation.
