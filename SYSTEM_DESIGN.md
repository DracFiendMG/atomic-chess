# Atomic Chess System Design

## 1. Goal

Build a browser-based Atomic Chess game with:
- Correct Atomic Chess rules
- Responsive and clear user interface
- Deterministic game engine separated from UI
- Extensible architecture for future features (AI, multiplayer, persistence)

## 2. Scope

Initial in-scope release (MVP):
- Local 2-player game on one device
- Full legal move generation with Atomic Chess rules
- Move execution, explosion resolution, turn handling
- Check/checkmate adapted to Atomic Chess semantics
- Game end detection and restart
- Move history list

Out of scope for MVP:
- AI opponent
- Online multiplayer
- Login/accounts/cloud saves

## 3. High-Level Architecture

The app should use a layered frontend architecture:

1. Presentation Layer
- React components for board, squares, pieces, game panel
- Pure rendering of state from engine
- Emits user intent events (select square, make move, restart)

2. Application Layer
- React hooks and controller logic
- Coordinates UI actions with game engine
- Maintains app-level concerns (selection, highlights, animations)

3. Domain Layer (Game Engine)
- Pure functions and immutable data operations
- Board representation and piece operations
- Legal move generation
- Atomic explosion rules
- Check and terminal-state logic

4. Infrastructure Layer
- Optional local storage persistence
- Optional notation export/import

Design principle:
- Game correctness must live in Domain Layer only.
- Presentation and Application layers must never implement chess rules directly.

## 4. Recommended Folder Structure

Create this structure as you implement:

- src/
- src/main.jsx
- src/App.jsx
- src/styles/
- src/styles/global.css
- src/components/
- src/components/Board.jsx
- src/components/Square.jsx
- src/components/Piece.jsx
- src/components/GamePanel.jsx
- src/components/MoveList.jsx
- src/hooks/
- src/hooks/useAtomicChess.js
- src/domain/
- src/domain/types.js
- src/domain/constants.js
- src/domain/coords.js
- src/domain/board.js
- src/domain/moveGenerator.js
- src/domain/moveValidator.js
- src/domain/atomicRules.js
- src/domain/gameState.js
- src/domain/endConditions.js
- src/domain/notation.js
- src/state/
- src/state/reducer.js
- src/state/actions.js
- src/utils/
- src/utils/assert.js
- src/utils/deepFreeze.js
- src/utils/clone.js
- src/tests/
- src/tests/domain/
- src/tests/domain/atomicRules.test.js
- src/tests/domain/moveGenerator.test.js
- src/tests/domain/endConditions.test.js

## 5. Core Domain Model

### 5.1 Coordinates

Board coordinates use zero-based indexes:
- file: 0 to 7
- rank: 0 to 7

Square id format:
- algebraic string, for example e4
- internal index optional: rank * 8 + file

### 5.2 Piece Model

Piece object:
- id: unique string
- type: king, queen, rook, bishop, knight, pawn
- color: white or black
- file: number
- rank: number
- hasMoved: boolean

### 5.3 Move Model

Move object:
- from: square
- to: square
- movingPieceId
- capturePieceId or null
- promotionType or null
- explodedPieceIds: list
- notation: string
- flags:
- isCapture
- isExplosion
- isCheck
- isCheckmate
- isStalemate

### 5.4 Game State Model

GameState object:
- board: 8x8 or square map
- turn: white or black
- status: active, check, checkmate, stalemate, draw
- winner: white, black, or null
- selectedSquare: UI only, keep outside domain if possible
- legalMovesCache: derived/cache
- moveHistory: array of Move
- halfMoveClock: number
- fullMoveNumber: number

## 6. Rule Engine Design

## 6.1 Atomic Capture Rule

When a capture occurs on target square T:
- Remove captured piece on T
- Remove capturing piece now located on T
- Remove all pieces on the 8 neighboring squares around T
- Exception: kings are never removed by explosion unless your chosen ruleset says otherwise

Rule note:
Atomic Chess variants differ on king explosion handling. Pick one ruleset and keep it consistent in tests and UI copy.

Recommended default:
- Kings are immune to explosion removal
- Kings still cannot make captures that would place themselves in illegal state

## 6.2 Move Legality Pipeline

For a side to move:

1. Generate pseudo-legal moves by piece movement pattern
2. For each candidate move:
- Simulate move on cloned state
- Apply capture and explosion resolution if capture
- Reject if own king becomes illegal
3. Remaining moves are legal

## 6.3 End Conditions

Evaluate after every legal move:

1. Opponent has no legal moves:
- If opponent king is under atomic-threat condition => checkmate
- Else => stalemate

2. Additional draw rules (optional in MVP):
- Insufficient material
- Threefold repetition
- 50-move rule

MVP recommendation:
- Implement checkmate/stalemate first
- Add advanced draw rules later

## 7. Game Flow

Single turn transaction:

1. User selects piece of current side
2. UI requests legal moves from engine
3. User picks target square
4. Application layer dispatches APPLY_MOVE
5. Domain layer validates and applies move
6. Domain layer computes explosion effects
7. Domain layer updates turn and status
8. UI rerenders board and move list

## 8. State Management Strategy

Use reducer-based state for determinism and testability.

Action types:
- START_NEW_GAME
- SELECT_SQUARE
- DESELECT_SQUARE
- APPLY_MOVE
- UNDO_MOVE
- LOAD_POSITION

Reducer contract:
- Input: previous state + action
- Output: next state
- No side effects inside reducer

Derived selectors:
- getPieceAt
- getLegalMovesForSquare
- isSquareHighlighted
- isInCheckLikeState
- getGameResult

## 9. UI Component Design

### Board
- Renders 8x8 grid
- Receives current board snapshot
- Emits square click events

### Square
- Pure visual cell
- States: normal, selected, legal target, capture target, last move, in-danger

### Piece
- Renders symbol or sprite
- No game logic

### GamePanel
- Shows turn, status, winner, restart button

### MoveList
- Shows chronological move history
- Optional click to inspect board at move n (future)

## 10. Performance Design

- Keep domain operations pure and small
- Memoize derived selectors
- Avoid recreating large objects unnecessarily
- Prefer square map keyed by algebraic id for simpler updates
- Batch UI updates naturally via React state reducer

Expected complexity targets:
- Move generation per turn: acceptable under 2 to 5 ms on average desktop
- Full UI response under 16 ms per user action

## 11. Testing Strategy

Priority should be Domain Layer tests first.

Test groups:

1. Piece movement tests
- Each piece legal movement patterns

2. Atomic explosion tests
- Capture square explosion
- Adjacent piece removals
- Edge and corner explosion behavior

3. Legality tests
- Illegal self-exposing king moves rejected
- King capture constraints per ruleset

4. End condition tests
- Checkmate/stalemate detection

5. Reducer tests
- Action transitions and history integrity

Suggested tools:
- Vitest
- React Testing Library for component behavior

## 12. Error Handling and Validation

- Validate every move request against legal move list
- Reject invalid move attempts gracefully in controller
- Keep domain functions defensive for invalid board inputs
- Add invariant assertions in development mode

## 13. Extensibility Plan

Design for future features:

1. AI integration
- Add engine adapter: getBestMove(state)
- Keep pure move apply function stable

2. Multiplayer
- Replace local controller with server-synced action stream
- Keep reducer deterministic for reconciliation

3. Persistence
- Save serialized GameState to localStorage
- Add import/export for custom positions

## 14. Security and Integrity

For local-only MVP, security needs are minimal.

Still important:
- Never execute dynamic code from saved positions
- Validate imported data shape before loading

## 15. Implementation Milestones

Milestone 1: Project Restructure
- Move entry from root files into src layout
- Add base components and reducer scaffold

Milestone 2: Board + Pieces
- Render initial position correctly
- Handle selection and highlights

Milestone 3: Legal Moves (Non-Atomic)
- Implement standard move generation and validation baseline

Milestone 4: Atomic Rules
- Add explosion resolution and atomic legality constraints

Milestone 5: Endgame + History
- Add status detection and move list panel

Milestone 6: Test Coverage
- Add domain-heavy test suite and key UI interaction tests

Milestone 7: Polish
- Responsive layout, keyboard accessibility, better visuals

## 16. Definition of Done for MVP

MVP is done when:
- All legal moves follow selected Atomic Chess ruleset
- Invalid moves are blocked
- Explosions are visualized and correctly resolved
- Game ends correctly in checkmate or stalemate
- Restart works without page refresh
- Core domain tests pass reliably

## 17. Immediate Next Coding Steps

1. Create src layout and move current entry files into modern Vite structure.
2. Implement domain types and board initialization.
3. Implement board rendering using static initial state.
4. Add move generation for pawns, knights, sliding pieces, king.
5. Add atomic capture/explosion logic and tests before UI polish.
