---
name: Geoforte Fundações
description: "Conceito 01 — Pilar: paper ground, graphite ink and bands, one driven orange; the letter and the foundation in the same form."
colors:
  brand: "#EF6C1A"
  brand-deep: "#D25A0E"
  brand-ink: "#B94E0C"
  brand-wash: "#FBF0E8"
  graphite: "#22252A"
  graphite-raised: "#2B2F36"
  paper: "#FAFAF8"
  canvas-sunk: "#F1F0EC"
  card: "#FFFFFF"
  ink-2: "#555B66"
  ink-3: "#696F7A"
  rule: "rgba(34, 37, 42, 0.12)"
  rule-strong: "rgba(34, 37, 42, 0.26)"
  data-series: "#D25A0E"
  soil-1: "#ECE3D2"
  soil-2: "#DDD0B6"
  water: "#2F6FB0"
  error: "#DC2626"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 4.9rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  numeral:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.375
  lead:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  clause-ref:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    fontFeature: "tnum"
  label:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  data-cap: "4px"
spacing:
  gutter: "20px"
  rule-to-title: "28px"
  row: "16px"
  block: "48px"
  section: "96px"
  section-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.graphite}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brand-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  segmented-option:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  segmented-option-active:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper}"
  input-field:
    backgroundColor: "{colors.canvas-sunk}"
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
  data-bar:
    backgroundColor: "{colors.data-series}"
    rounded: "{rounded.data-cap}"
    height: "18px"
  missing-figure:
    backgroundColor: "{colors.brand-wash}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.none}"
    padding: "32px 24px"
---

# Design System: Geoforte Fundações

## Overview

**Creative North Star: "The Driven Pile"**

Everything in this system descends from the mark: a geometric "G" whose stem keeps going into the ground as a driven pile. The site reads like an engineer's sheet set on good paper. Graphite type on a warm off-white ground, hairline rules doing the structural work, square corners everywhere, and a single orange that marks where force enters: the action, the opening stroke of a section, the pile in a drawing. Density is moderate and editorial; content is organised by rules and numerals rather than boxes and badges.

Depth comes from tone, not from lift. Dark graphite bands (hero, integrated solution, contact, footer, proposal cover and closing) redefine the surface tokens in place, so the same ink, rule and card roles keep working inside them. Motion is mechanical and singular: things are driven in once from their baseline, like a pile, and then stay put.

The technical drawing is a first-class citizen of the world, not an illustration bolted on. Soil sections, cross-sections and data charts are drawn in the system's own tokens (ink-dot hatching, hairline grids, Space Grotesk dimension text, the data orange for the measured series) and stay legible on paper, on graphite and in the dark theme.

**Key Characteristics:**
- Paper ground, graphite ink, graphite bands; orange is scarce and always means action or force.
- The driven rule (2px, orange for 56px, then hairline) opens sections instead of any label above the title.
- Square corners; the only radius is the 4px cap at the end of a data bar.
- Numerals in Space Grotesk, tabular, used as structure (clause numbers, chapter numbers, dimensions).
- Flat surfaces; depth by tonal bands, not shadows.
- One motion idea: drive in once from the baseline, then rest.

## Colors

Three brand colors and an accessibility variant, plus a small drawing palette; every surface color is a context token that a graphite band or the dark theme redefines.

### Primary
- **Geoforte Orange** (brand): the mark's ring, primary buttons, the orange head of the driven rule, the reading-progress bar, the active stroke in the chapter index, piles in drawings, text selection. On paper it is a fill or large text only (2.9:1 on paper as text).
- **Burnt Orange** (brand-ink): the same hue for small orange text and icons on paper (4.8:1): chapter numerals, clause links, values in spec lists. Inside graphite bands and the dark theme this role resolves back to Geoforte Orange.
- **Driven Orange** (brand-deep): hover/pressed fill for orange buttons.

### Secondary
- **Data Orange** (data-series): the single measured series in charts and drawings (bars, the billing split, the schedule bar, the strut, the hover depth line). Validated for at least 3:1 and color-vision checks on paper, graphite and the dark ground. Shares its value with Driven Orange but is a separate token with a separate job; charts reference this token, never the brand orange.
- **Orange Wash** (brand-wash): background behind a missing figure or a highlighted placeholder; 12% orange on dark grounds.

### Tertiary
- **Sand** and **Deep Sand** (soil-1, soil-2): the two soil strata fills in technical cross-sections, always overlaid with ink-dot hatching. Dark grounds use #3A352C / #2F2A22.
- **Water Blue** (water): the water-table line and its marker triangle in sections; #6AA5E0 on dark grounds. Used for nothing else.

### Neutral
- **Graphite** (graphite): primary ink on paper and the fill of every dark band. As the ink token it becomes Paper inside bands.
- **Raised Graphite** (graphite-raised): card surface inside a graphite band.
- **Paper** (paper): default canvas of every page and the ink on graphite.
- **Sunk Paper** (canvas-sunk): alternating section ground, input fields, scrollbar track. #1B1E22 inside bands, #0F1114 in the dark theme.
- **White Card** (card): drawing frames and spec panels on paper.
- **Slate** (ink-2): secondary text, leads, descriptions. #A8ADB6 on dark.
- **Steel** (ink-3): tertiary text, clause numbers in lists, captions, placeholders. #8D939D on dark.
- **Hairline** and **Strong Hairline** (rule, rule-strong): dividers between rows, button outlines, grid ticks. Inverted to paper-based alpha on dark.
- **Error Red** (error): form validation text and field border only.

### Named Rules
**The Scarce Orange Rule.** Orange marks action and force, never ambience: buttons, the head of the driven rule, the pile, the progress bar. A section is never filled with brand orange.

**The Small-Text Burn Rule.** Orange text below roughly 18px on paper uses Burnt Orange, never Geoforte Orange.

**The Context Token Rule.** Never hard-code a light-surface color inside a component that may sit in a graphite band. Use the context roles (canvas, card, ink, ink-2, ink-3, rule, brand-ink) so `.on-graphite` and the dark theme can redefine them.

**The One Series Rule.** A chart carries one measured series in Data Orange; a second part is graphite ink, and identity comes from the in-bar label, not from a second hue.

## Typography

**Display Font:** Space Grotesk (with system-ui, sans-serif), weights up to 700
**Body Font:** Manrope (with system-ui, sans-serif)

**Character:** Space Grotesk brings the technical, slightly mechanical voice of the mark (the logotype is its 700 weight) to every title, numeral, button and dimension; Manrope carries the reading text quietly. Titles are always bold with tight negative tracking; body is relaxed and measured.

### Hierarchy
- **Display** (700, clamp(2.6rem, 6vw, 4.9rem), 1.02, -0.035em): the page's one h1 on hero and cover bands; the proposal cover runs up to 5rem at 0.98.
- **Headline** (700, clamp(2rem, 4.2vw, 3.25rem), 1.04, -0.03em): section titles under the driven rule; chapter titles use clamp(1.8rem, 3.3vw, 2.75rem).
- **Numeral** (700, clamp(2.1rem, 4vw, 3.25rem), tabular, Burnt Orange): the chapter or clause number set on the baseline beside a headline. Smaller numerals (22px, brand orange on graphite) number execution steps.
- **Title** (700, 17px, snug): list-item titles, sub-heads, definition terms; 19px for subsections inside a chapter.
- **Lead** (400, 17px, 1.625): the paragraph under a section title, max 58 to 64ch.
- **Body** (400, 15 to 15.5px, 1.625): running text, max 62 to 66ch.
- **Clause reference** (600, 13px, Space Grotesk, tabular, Steel): clause numbers in lists and the trailing source reference after a sentence.
- **Label** (700, 11px, 0.14 to 0.16em, uppercase): form field labels, definition terms in contact data, footer column titles, card captions in the brand manual. Labels sit with their field or value; they are never set above a headline.

### Named Rules
**The Numeral Is Structure Rule.** Numbers are set in Space Grotesk with tabular figures. Where a document has numbered clauses, the number is the section marker, set large in Burnt Orange beside the title, and every number matches its source document.

**The No Kicker Rule.** A section opens with the driven rule and the title. No eyebrow, tagline or category label above a headline.

## Layout

Site sections use a single centered container (72rem, 20px side gutter) with vertical rhythm of 96px, 128px from the small breakpoint up; alternating sections switch to Sunk Paper or to a graphite band instead of drawing boxes. Section heads are the driven rule (max 16rem, 10rem when centered), then 28px, then the headline, then the lead at 16px.

Content is gridded by hairlines: lists, definition lists, spec tables and clause lists are rows separated by a top hairline with 12 to 28px vertical padding, often a two-column grid of a fixed term column (3 to 15rem) and a fluid text column. A 2px graphite rule closes a list or states a total.

Long documents (the proposal) widen to 90rem with a 14rem sticky chapter index on the left and a 58rem reading column; on mobile the index becomes a horizontally scrolling row of outlined chips. Covers can split 7/12 graphite media to 5/12 paper content from the large breakpoint. Breakpoints are the Tailwind defaults (640, 768, 1024, 1280px); anchors scroll with 88px top padding for the fixed bar.

## Elevation & Depth

The system is flat. Depth is conveyed by tonal bands (paper, sunk paper, graphite, raised graphite), by full-bleed media under a graphite gradient scrim, and by hairlines. The fixed top bar is paper at 95% with a background blur and a bottom hairline. Two shadows exist in the build and both are situational: a long, soft drop under the contact form card where it sits on a graphite band, and a soft hover shadow on timeline cards. Neither is a general elevation scale.

### Shadow Vocabulary
- **Form on band** (`box-shadow: 0 30px 60px -24px rgba(0,0,0,0.35)`): the white form card floating on the graphite contact band.
- **Card hover** (`box-shadow: 0 8px 28px -12px rgba(34,37,42,0.22)`): hover response on timeline cards, paired with the border moving to Strong Hairline.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Separate with a hairline or a tonal band before reaching for a shadow; a shadow only answers hover or a card lifted off a dark band.

## Shapes

Square corners throughout: buttons, inputs, cards, segmented options, chips, images and media plates have no radius. The one rounded form is the 4px cap on the leading end of a data bar, so the bar reads as a driven element with a head. Borders are 1px hairlines; 2px for the driven rule, the closing total rule, the active chapter stroke, the progress bar and the missing-figure frame (dashed). Recurring geometry comes from the mark: the circle with a 32 degree wedge, the vertical pile with a pointed tip, the downward triangle used as level markers in sections. List bullets are 6px squares in Steel.

## Components

### Buttons
Blunt, solid and short-worded; the orange button is the only orange block on a screen.
- **Shape:** square (0px).
- **Primary:** Geoforte Orange fill, Graphite text, Space Grotesk 700 at 15px, 16px by 24 to 32px padding (compact bar version 10px by 16px at 14px).
- **Hover / Focus:** fill shifts to Driven Orange with a color transition; focus is a 2px outline in the focus-ring color (Burnt Orange on paper, Geoforte Orange on dark) offset 3px. A trailing arrow icon may nudge 2 to 4px on hover.
- **Secondary:** transparent with a 1px Strong Hairline border, ink text, Space Grotesk 600; hover darkens the border to ink (and adds a 5% paper tint on graphite).
- **Text action:** Space Grotesk 600 at 13 to 14px in Burnt Orange (or Slate to ink), with an inline icon; underline on hover.

### Chips (segmented options)
- **Style:** square, 1px Strong Hairline border, Slate text, Space Grotesk 500 at 13.5 to 14px, 10px by 16px.
- **State:** selected is a solid Graphite fill with Paper text (inverted ink on dark); hover darkens border and text to ink. Used for the contact project-type radio group and the memorial contention/phase switches.

### Cards / Containers
- **Corner Style:** square.
- **Background:** White Card on paper, Raised Graphite on bands, or a full graphite plate with media.
- **Shadow Strategy:** none at rest (see Elevation & Depth).
- **Border:** 1px Hairline.
- **Internal Padding:** 24 to 40px.

### Inputs / Fields
- **Style:** Sunk Paper fill, 1px Strong Hairline border, square, 14px by 16px, Manrope 15px; orange caret.
- **Focus:** border becomes Geoforte Orange and the fill lifts to canvas.
- **Error / Disabled:** Error Red border and a 12px error line with an alert icon; disabled buttons fill with Steel.

### Navigation
- **Style:** fixed bar, 72px tall on the site (64px on proposals), paper at 95% with blur and a bottom hairline; over the home hero it is transparent on graphite.
- **Typography:** Space Grotesk 500 at 13.5px in Slate, ink on hover with a 2px orange underline that grows from the left.
- **Progress:** a 2px brand-orange bar scaled by scroll progress at the top edge (site) or the bottom edge (proposal bar).
- **Mobile:** menu collapses below 1280px into a stacked list of hairline rows and a full-width orange action.

### Driven Rule (signature)
The section opener: a 2px line, Geoforte Orange for the first 56px then Hairline to the end, 16rem wide (10rem in centered or compact heads), followed 28px later by the headline. It replaces every label above a title and reappears inside graphite bands unchanged.

### Chapter Index (signature)
Sticky list of chapter numerals and titles. Inactive: Steel text with a 2px Hairline left stroke; active: ink text, semibold, numeral in Burnt Orange, left stroke in Geoforte Orange. Scroll-spied; on mobile, outlined square chips in a scroll row.

### Clause List (signature)
Rows separated by top hairlines; a 3rem column holds the clause number in the clause-reference style, the text column holds the clause in body type. Long clauses use a 15rem bold title column. Optional two-column flow on medium screens.

### Technical Drawing (signature)
Cross-sections and soil sections drawn in SVG with system tokens only: strata in Sand and Deep Sand (or ink at low opacity) overlaid with ink-dot hatching (1 to 1.6px dots at 0.2 to 0.28 opacity on a 14 to 18px tile; line, cross and diagonal hatches for other strata); piles in ink or Geoforte Orange with a pointed tip; water table in Water Blue with a downward triangle; dimension text in Space Grotesk with a minus sign (−) and Brazilian decimals; hairline grids in Hairline. Labels grow on small screens so they stay legible as the drawing shrinks.

### Data Bar (signature)
One series in Data Orange, 18px tall (56px for a labelled split), 4px cap on the end, value in Space Grotesk 700 tabular at the tip. Parts of a whole are separated by a 2px gap; the second part is ink. Hovering one bar dims the others to 35%. Bars scale in from their baseline once on first view.

### Missing Figure
A figure the source does not contain is shown, never invented: inline as Burnt Orange semibold text on Orange Wash in brackets; as a block, a 2px dashed Burnt Orange frame on Orange Wash with a bold bracketed instruction.

### Motion
One grammar on two curves. Site ease `cubic-bezier(0.16, 1, 0.3, 1)` for reveals and morphs; the pile curve `cubic-bezier(0.65, 0, 0.35, 1)` (even, so the descent is seen) for anything driven from a baseline: the mark's pile, soil-section piles, data bars, schedule bars. Driven marks run once on first view, 0.7 to 1.5s, with small staggers. All motion respects reduced-motion (framer-motion `reducedMotion="user"` plus CSS fallbacks).

## Do's and Don'ts

### Do:
- **Do** open every section with the driven rule (2px, 56px of Geoforte Orange into Hairline) and the headline 28px below it.
- **Do** keep orange for the action, the rule head, the pile and the progress bar; use Burnt Orange for small orange text on paper.
- **Do** build dark sections as graphite bands that redefine the context tokens, and write components only against those tokens.
- **Do** set every number in Space Grotesk with tabular figures, and use clause or chapter numerals as the structural marker where the source is numbered.
- **Do** separate content with hairline rows and close totals with a 2px ink rule.
- **Do** draw charts and sections in the system tokens: Data Orange for the one measured series, Sand strata with ink-dot hatching, Water Blue only for water.
- **Do** drive data marks in once from their baseline on the pile curve, and respect reduced motion.
- **Do** show a missing figure as a visible bracketed placeholder on Orange Wash.

### Don't:
- **Don't** place an eyebrow, kicker or tagline above a headline; the driven rule is the opener.
- **Don't** round corners on buttons, inputs, cards or images; the 4px data-bar cap is the only radius.
- **Don't** use Geoforte Orange for small text on paper.
- **Don't** use the brand orange as a chart color or add a second chart hue; charts use Data Orange and ink.
- **Don't** add shadows to resting surfaces on the same ground; use a tonal band or a hairline. The one resting shadow is a light card lifted off a graphite band.
- **Don't** hard-code light-surface colors inside components that can sit on a graphite band or in the dark theme.
- **Don't** recolor, rotate, distort or retype the mark; the pile is always vertical.
- **Don't** loop or repeat driven animations; a mark is driven once.
