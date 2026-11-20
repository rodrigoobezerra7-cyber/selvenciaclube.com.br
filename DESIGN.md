# Design Brief

## Direction

SELVÊNCIA — Central de Operações: a dark tactical operations console where every visitor is a community member, not a customer.

## Tone

Industrial/utilitarian military console — olive-black surfaces, amber signal lights, mono telemetry labels, and hazard stripes executed with restraint.

## Differentiation

Every surface reads as an instrument panel: corner brackets, grid overlays, live status dots and mono coordinate labels make browsing the Arsenal feel like monitoring a command post.

## Color Palette

| Token      | OKLCH           | Role                                  |
| ---------- | --------------- | ------------------------------------- |
| background | 0.185 0.014 145 | olive-black console base              |
| foreground | 0.93 0.012 120  | bone-white readouts                   |
| card       | 0.225 0.016 145 | raised instrument panels              |
| primary    | 0.74 0.17 68    | amber signal / action                 |
| accent     | 0.78 0.16 92    | warning yellow for alerts & highlights |
| muted      | 0.26 0.014 145  | recessed wells, section alternation   |
| destructive| 0.58 0.19 27    | critical red                          |
| success    | 0.72 0.16 150   | operational green status              |

## Typography

- Display: Space Grotesk — headings, "Central de Operações", product names, tight tracking
- Body: DM Sans — paragraphs, descriptions, form fields
- Mono: JetBrains Mono — status labels, coordinates, prices, category codes, checklists
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight uppercase`, h2 `text-2xl md:text-4xl font-bold tracking-tight`, label `font-mono text-xs uppercase tracking-[0.2em]`, body `text-base text-muted-foreground`

## Elevation & Depth

Flat layered panels: `border` hairlines plus `shadow-subtle`/`shadow-elevated` for lift, never glow — depth comes from surface steps (background → card → popover) and inset wells.

## Structural Zones

| Zone    | Background                  | Border                | Notes                                             |
| ------- | --------------------------- | --------------------- | ------------------------------------------------- |
| Header  | bg-card/90 backdrop-blur    | border-b border-border| amber status dot, mono nav, Arsenal link, member chip |
| Content | bg-background               | —                     | alternate sections with bg-muted/30 + grid-overlay |
| Footer  | bg-sidebar                  | border-t border-border| mono community coordinates, hazard-stripe accent  |

## Spacing & Rhythm

Sections use `py-16 md:py-24` with `gap-6` card grids; micro-spacing tight (4–8px) inside instrument labels for density.

## Component Patterns

- Buttons: near-square (4px), amber `bg-primary` fill with dark text, uppercase mono label, hover brightens + `shadow-subtle`
- Cards: 4px radius, `bg-card` + `border-border`, corner-brackets on hero/product cards, hover border shifts to amber
- Badges: sharp rectangles, mono uppercase, `bg-muted` or `bg-success/15 text-success` for status

## Motion

- Entrance: `animate-fade-in` staggered 80ms on cards and hero blocks
- Hover: border/text shift to amber in 250ms via `transition-smooth`
- Decorative: `animate-pulse-dot` on live status, `animate-scan-line` on hero panel only

## Constraints

- Dark mode only — no light theme toggle
- No rounded pills, no neon glows, no gradient backgrounds beyond `bg-gradient-subtle`
- All color via semantic tokens; mono font reserved for data/labels, never paragraphs

## Signature Detail

Corner-bracket framed panels with a pulsing amber status dot — the "live operations console" signature.
