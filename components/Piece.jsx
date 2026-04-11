const COLOR_PALETTES = {
    white: {
        primary: "#f6efe3",
        secondary: "#dfd0b9",
        stroke: "#2d2418",
    },
    black: {
        primary: "#2d2418",
        secondary: "#4b3d2d",
        stroke: "#efe5d3",
    },
};

function PieceSvg({ color, children }) {
    const palette = COLOR_PALETTES[color] ?? COLOR_PALETTES.white;

    return (
        <svg
            className="piece-svg"
            viewBox="0 0 100 100"
            aria-hidden="true"
            focusable="false"
        >
            {children(palette)}
        </svg>
    );
}

function KingIcon({ color }) {
    return (
        <PieceSvg color={color}>
            {(palette) => (
                <>
                    <g
                        fill={palette.primary}
                        stroke={palette.stroke}
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    >
                        <path d="M50 10v14" />
                        <path d="M43 17h14" />
                        <path d="M33 30h34l-3 14h-28z" />
                        <path d="M36 44h28l6 27h-40z" />
                        <ellipse cx="50" cy="80" rx="23" ry="7" />
                    </g>
                    <ellipse
                        cx="50"
                        cy="80"
                        rx="16"
                        ry="4"
                        fill={palette.secondary}
                        stroke={palette.stroke}
                        strokeWidth="3"
                    />
                </>
            )}
        </PieceSvg>
    );
}

function QueenIcon({ color }) {
    return (
        <PieceSvg color={color}>
            {(palette) => (
                <>
                    <g
                        fill={palette.primary}
                        stroke={palette.stroke}
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    >
                        <circle cx="22" cy="24" r="5" />
                        <circle cx="36" cy="18" r="5" />
                        <circle cx="50" cy="15" r="5" />
                        <circle cx="64" cy="18" r="5" />
                        <circle cx="78" cy="24" r="5" />
                        <path d="M24 30l8 30h36l8-30-14 10-12-14-12 14z" />
                        <ellipse cx="50" cy="80" rx="25" ry="7" />
                    </g>
                    <ellipse
                        cx="50"
                        cy="80"
                        rx="17"
                        ry="4"
                        fill={palette.secondary}
                        stroke={palette.stroke}
                        strokeWidth="3"
                    />
                </>
            )}
        </PieceSvg>
    );
}

function RookIcon({ color }) {
    return (
        <PieceSvg color={color}>
            {(palette) => (
                <>
                    <g
                        fill={palette.primary}
                        stroke={palette.stroke}
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    >
                        <rect x="30" y="18" width="8" height="14" />
                        <rect x="46" y="18" width="8" height="14" />
                        <rect x="62" y="18" width="8" height="14" />
                        <rect x="28" y="32" width="44" height="9" />
                        <path d="M32 41h36l-3 28h-30z" />
                        <ellipse cx="50" cy="80" rx="24" ry="7" />
                    </g>
                    <ellipse
                        cx="50"
                        cy="80"
                        rx="16"
                        ry="4"
                        fill={palette.secondary}
                        stroke={palette.stroke}
                        strokeWidth="3"
                    />
                </>
            )}
        </PieceSvg>
    );
}

function BishopIcon({ color }) {
    return (
        <PieceSvg color={color}>
            {(palette) => (
                <>
                    <g
                        fill={palette.primary}
                        stroke={palette.stroke}
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    >
                        <circle cx="50" cy="20" r="7" />
                        <path d="M50 27v12" />
                        <path d="M50 34c10 7 14 15 14 24 0 8-6 13-14 13s-14-5-14-13c0-9 4-17 14-24z" />
                        <ellipse cx="50" cy="80" rx="24" ry="7" />
                    </g>
                    <ellipse
                        cx="50"
                        cy="80"
                        rx="16"
                        ry="4"
                        fill={palette.secondary}
                        stroke={palette.stroke}
                        strokeWidth="3"
                    />
                </>
            )}
        </PieceSvg>
    );
}

function KnightIcon({ color }) {
    return (
        <PieceSvg color={color}>
            {(palette) => (
                <>
                    <g
                        fill={palette.primary}
                        stroke={palette.stroke}
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    >
                        <path d="M66 27c-3-6-11-8-17-6-5 2-10 7-11 13l-8 13 10 5-4 18h37l-3-10c0-8-3-14-11-19l3-6h-10l5-8z" />
                        <circle cx="56" cy="34" r="2.5" fill={palette.stroke} stroke="none" />
                        <ellipse cx="50" cy="80" rx="24" ry="7" />
                    </g>
                    <ellipse
                        cx="50"
                        cy="80"
                        rx="16"
                        ry="4"
                        fill={palette.secondary}
                        stroke={palette.stroke}
                        strokeWidth="3"
                    />
                </>
            )}
        </PieceSvg>
    );
}

function PawnIcon({ color }) {
    return (
        <PieceSvg color={color}>
            {(palette) => (
                <>
                    <g
                        fill={palette.primary}
                        stroke={palette.stroke}
                        strokeWidth="4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    >
                        <circle cx="50" cy="26" r="10" />
                        <path d="M50 36c9 0 16 8 16 18 0 6-3 10-6 14h-20c-3-4-6-8-6-14 0-10 7-18 16-18z" />
                        <ellipse cx="50" cy="80" rx="22" ry="7" />
                    </g>
                    <ellipse
                        cx="50"
                        cy="80"
                        rx="14"
                        ry="4"
                        fill={palette.secondary}
                        stroke={palette.stroke}
                        strokeWidth="3"
                    />
                </>
            )}
        </PieceSvg>
    );
}

const PIECE_ICONS = {
    king: KingIcon,
    queen: QueenIcon,
    rook: RookIcon,
    bishop: BishopIcon,
    knight: KnightIcon,
    pawn: PawnIcon,
};

export default function Piece({ piece }) {
    const Icon = PIECE_ICONS[piece.type];

    return (
        <span className={`piece piece-${piece.color}`} aria-label={`${piece.color} ${piece.type}`}>
            {Icon ? <Icon color={piece.color} /> : null}
        </span>
    );
}
