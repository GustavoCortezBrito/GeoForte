# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Site (inferred from the site copy, not interviewed):** construction companies, developers and their engineers looking for a deep-foundation and retaining-structure contractor, mostly in Salvador and the Northeast of Brazil.
- **Proposal pages (confirmed):** two readers of the same link. The client's leadership approves the contract and needs scope, price, schedule and risks in minutes. The client's engineering and procurement team compares bids and checks the calculation memorial, standards and premises.

## Product Purpose

Geoforte Fundações' site presents the company and turns visits into technical diagnosis requests (contact form). Proposal pages present one specific commercial proposal as a web page next to its PDF; success is the client understanding scope, price, schedule and risks and moving to accept or talk.

## Positioning

What a proposal page must prove (confirmed):

- **Design and execution in one hand:** executive geotechnical design plus full execution with Geoforte's own crews and rigs.
- **Verified engineering:** a calculation memorial whose checks all pass, shown visually (excavation phases, safety factors).
- **Proven experience:** works executed in Salvador with the same solution, GeoSelos seal, ABEF membership.
- **Clear terms:** price, payment, schedule and risks stated plainly, with the full PDF to download.

## Operating Context

- Proposals travel as a private link plus the PDF, read on desktop and compared with competing bids.
- Legal names: Geoforte (brand); Geofor Obras de Fundações Ltda (company, CNPJ 26.214.785/0001-99); GEO TÉCNICA FUNDAÇÕES (bills equipment rental, CNPJ 35.254.214/0001-79).

## Capabilities and Constraints

- Next.js 16 App Router site, Tailwind v4 tokens, framer-motion; hosted on Vercel.
- Proposal pages are private links: noindex, outside the sitemap and the site menu (confirmed).
- Proposal content comes from `tools/proposta/dados`, the same source as the PDF generator. Never invent numbers; missing data stays visible as a placeholder until filled.
- Generated imagery (Higgsfield) is illustrative atmosphere only, never presented as a Geoforte work. Photos of executed works are used untouched; `manakai-1.jpg` and `manakai-2.jpg` are banned (look AI-processed).

## Brand Commitments

- Identity "Conceito 01 — Pilar" (manual at `/marca`): orange #EF6C1A, burnt orange #B94E0C for small text on paper, graphite #22252A, paper #FAFAF8; Space Grotesk for titles and numbers, Manrope for text.
- Imagery must not look AI-generated (repeated user feedback).

## Evidence on Hand

- Proposal GEO 2701A/25 (Expansão Grand Palladium Imbassaí): clauses, scope areas, phases and calculation results in `tools/proposta/dados/`.
- 8 real photos of 4 executed works in `tools/proposta/assets/fotos/` (~970 px wide), ABEF and GeoSelos logos, GeoSelos certificate.
- Company stats in `src/lib/data.ts`.
- Absent, do not fabricate: the proposal's global price table (Tabela 01 is missing in the original), the works' technical sheets (area, height, piles, dates, neighborhood, year), testimonials.

## Product Principles

1. Prove with engineering data, not adjectives.
2. Never invent numbers; a missing figure is shown as missing.
3. One source of truth for proposal content, PDF and web alike.
4. Honest imagery: real photos for real works, generated images only as atmosphere.

## Accessibility & Inclusion

- Respect `prefers-reduced-motion` (site convention: framer-motion `MotionConfig reducedMotion="user"` plus CSS fallbacks).
- Small text on paper uses burnt orange #B94E0C, not brand orange (contrast).
