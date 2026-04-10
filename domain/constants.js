export const BOARD_SIZE = 8;

export const WHITE = "white";
export const BLACK = "black";

export const PIECE_TYPES = {
    KING: "king",
    QUEEN: "queen",
    ROOK: "rook",
    BISHOP: "bishop",
    KNIGHT: "knight",
    PAWN: "pawn",
};

export const GAME_STATUS = {
    ACTIVE: "active",
    CHECK: "check",
    CHECKMATE: "checkmate",
    STALEMATE: "stalemate",
};

export const PROMOTION_DEFAULT = PIECE_TYPES.QUEEN;

// Chosen ruleset: kings are not removed by explosion effects.
export const KINGS_IMMUNE_TO_EXPLOSION = true;
