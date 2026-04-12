# Atomic Chess

Atomic Chess is a React + Vite web app for building a chess experience with an explosive twist.

## System Design

- Detailed architecture and implementation blueprint: [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)
- AI opponent design and minimax details: [AI_PLAYER.md](AI_PLAYER.md)

## Project Overview

This repository is the foundation of a modern frontend app for Atomic Chess. The project currently has the Vite + React environment set up and running, with a minimal starter UI.

## Current Status

The app is in an early scaffold stage.

What is already present:
- Vite development setup
- React app entrypoint and root rendering
- Base `App` component
- Stylesheet linked in HTML
- Git repository metadata and GitHub links

What is currently minimal / pending:
- Chess board rendering
- Piece movement logic
- Atomic Chess explosion mechanics
- Game state management
- Move validation rules
- Win/loss conditions and game-end handling
- UI polish and responsive design

## Tech Stack

- React `19.2.4`
- React DOM `19.2.4`
- Vite `8.0.3`
- `@vitejs/plugin-react` `6.0.1`

## Author

- **Sreeram Reddy Velagala**

## Repository

- GitHub: https://github.com/DracFiendMG/atomic-chess
- Issues: https://github.com/DracFiendMG/atomic-chess/issues

## Project Structure

```text
atomic-chess/
|- App.jsx
|- index.html
|- index.jsx
|- style.css
|- vite.config.js
|- package.json
|- package-lock.json
|- README.md
```

## File Roles

- `index.html`: Root HTML file containing the app mount point (`#root`) and stylesheet/script links.
- `index.jsx`: React entrypoint that mounts `App` into the DOM.
- `App.jsx`: Main application component (currently renders `Hello`).
- `style.css`: Global stylesheet (currently empty).
- `vite.config.js`: Vite configuration with React plugin enabled.
- `package.json`: Project metadata, scripts, and dependencies.

## Prerequisites

Make sure you have installed:
- Node.js (recommended: latest LTS)
- npm (comes with Node.js)

## Installation

```bash
npm install
```

## Available Scripts

### Start Development Server

```bash
npm run dev
```

This starts Vite in development mode.

### Test Script (placeholder)

```bash
npm test
```

Current behavior:
- This script intentionally exits with an error because tests are not configured yet.

## Running the App

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL printed by Vite in the terminal.

## Atomic Chess Rules (Planned Core Gameplay)

Intended rule behavior for this project:
- Captures trigger an explosion.
- The capturing piece also explodes.
- All pieces on surrounding 8 squares are removed by explosion.
- Kings cannot capture if that would explode themselves.
- Check/checkmate behavior differs from standard chess and should be adapted to Atomic Chess end conditions.

> Note: The above rules are listed as design intent and are not implemented yet in the current code.

## Suggested Roadmap

1. Build board and piece rendering.
2. Add game state representation (position, turn, history).
3. Implement legal move generation.
4. Add atomic explosion resolution.
5. Add turn handling and endgame logic.
6. Add UI features: highlights, move history, restart, and status indicators.
7. Add unit tests for move legality and explosion logic.
8. Prepare production build and deployment.

## Development Notes

- The app currently uses `index.jsx` as the module entry loaded directly from `index.html`.
- Styling is not yet defined in `style.css`.
- The default `test` script is a placeholder and should be replaced when test tooling is introduced (e.g., Vitest + React Testing Library).

## Possible Next Enhancements

- Move notation panel
- Last move animation
- Undo / redo support
- FEN import/export
- PGN-like match logging
- AI opponent
- Online multiplayer

## License

This project is currently marked as `ISC` in `package.json`.

## Contributing

Contributions are welcome as the project evolves.

A basic contribution flow:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request with a clear description of improvements.

## Contact

For suggestions and bug reports, use the GitHub Issues page:
https://github.com/DracFiendMG/atomic-chess/issues
