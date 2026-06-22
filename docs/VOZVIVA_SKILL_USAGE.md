# VOZVIVA_SKILL_USAGE.md — Skill Repo Usage Log

## 1. design-skills (ihlamury/design-skills)

**Files inspected:**
- `.agent-skills/design-skills/skills/shopify/SKILL.md`
- `.agent-skills/design-skills/skills/awwwards/SKILL.md`
- `.agent-skills/design-skills/skills/descript/SKILL.md`
- `.agent-skills/design-skills/skills/mailchimp/SKILL.md`

**Principles applied:**

| Principle | Source | Application in VozViva |
|---|---|---|
| 4px grid spacing system | Shopify | CSS `--space-*` tokens in 4px multiples (0.5rem = 8px base) |
| Single font family for consistency | Shopify/Awwwards | Fraunces (display) + Manrope (UI) — two complementary families only |
| `text-balance` on headings | Shopify | Applied to `.hero-headline`, `.section-heading`, `.final-cta-heading` |
| Minimum 4.5:1 contrast ratio | Shopify | ink (#161312) on paper (#fbf3e7): ~13:1 |
| Strong editorial bold heading | Awwwards | Hero H1: Fraunces 800, `clamp(2.4rem, 5vw, 4rem)` |
| Dark surface raised cards | Descript | Command card uses `background: var(--ink)` = #161312 |
| Warm surface treatment | Descript | Warm paper background (#fbf3e7), cream card (#fffaf1) |
| Conversion-focused CTA clarity | Mailchimp | Action verbs on all CTAs: "Quiero", "Activar", "Crear" |

**Principles rejected:**

| Principle | Reason |
|---|---|
| Inter as primary font | Replaced with Fraunces+Manrope for warmer LATAM editorial feel |
| Light backgrounds only (Shopify) | Dark sections used for Problem + Final CTA to create visual rhythm |
| #FEFEFE page background | Used #fbf3e7 (warm paper) to avoid sterile SaaS feel |
| Blue/purple gradients (generic AI) | Replaced with clay/coral + gold LATAM palette per brief |

---

## 2. design-ui-ux (ytx-readings/design-ui-ux)

**Files inspected:** Repository was attempted (clone failed — private or unavailable).
**Fallback:** Applied design reasoning from canonical UX principles:

**Principles applied:**

| Principle | Application |
|---|---|
| Information hierarchy before detail | Problem section establishes need before "How It Works" |
| Progressive disclosure | FAQ uses `<details>` — answers hidden until needed |
| Low-friction onboarding | 3-step "how it works" with single short sentences |
| Conversion flow rhythm | Hero CTA → See examples → Pricing → Final CTA — logical flow |
| Wayfinding | Sticky header with anchor nav links to all sections |
| Readability | Body text: 0.875–1.05rem, line-height 1.55–1.65, max-width 60–65ch |

---

## 3. uigen (darula-hpp/uigen)

**Files inspected:** Repository was attempted (clone failed — private or unavailable).
**Fallback:** Applied declarative UI mindset described in brief:

**Principles applied:**

| Principle | Application |
|---|---|
| Content-first, structure-driven | HTML sections defined as data blocks: hero, problem, steps, examples, features, pricing, suite, faq, cta |
| Repeated sections from structured data | Pricing cards, example cards, feature items share consistent HTML patterns |
| No over-engineering | Static HTML/CSS/JS — no framework, no build pipeline, no OpenAPI backend |
| Single source of truth for copy | All copy lives in HTML (no external JSON required for static MVP) |

---

## 4. GSAP (greensock/GSAP)

**Files inspected:**
- `.agent-skills/GSAP/README.md`
- `.agent-skills/GSAP/package.json`
- `.agent-skills/GSAP/src/` (structure only)

**Integration:** GSAP 3.12.5 loaded via CDN (CloudFlare-backed):
```
https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
```

**GSAP features used:**

| Feature | Usage |
|---|---|
| `gsap.timeline()` | Hero entrance sequence — staggered 8-element intro |
| `gsap.from()` + ScrollTrigger | Section reveal animations for all major grids |
| `gsap.to()` | Phone mockup bob (repeat: -1, yoyo) |
| `gsap.to()` on `mousemove` | CTA magnetic hover effect |
| `ScrollTrigger.create()` | Via `scrollTrigger` option in all `gsap.from()` calls |
| `once: true` | Prevents re-trigger on scroll-up |

**Constraints respected:**
- `prefers-reduced-motion` → JS returns early, CSS nullifies transitions
- No bounce/elastic on page load
- No scroll-jacking
- No WebGL/canvas
- Animations do not block content readability

---

## 5. impeccable (pbakaus/impeccable)

**Files inspected:**
- `.agent-skills/impeccable/README.md`
- `.agent-skills/impeccable/DESIGN.md`
- `.agent-skills/impeccable/PRODUCT.md`
- `.agent-skills/impeccable/CLAUDE.md`
- `.agent-skills/impeccable/skill/` directory structure

**CLI status:** Not run (Astro/Wrangler build environment not available in this container).

**Output:** Full manual phase audit documented in `docs/IMPECCABLE_REVIEW.md`.

Phases completed:
- [x] init
- [x] shape
- [x] clarify
- [x] layout
- [x] typeset
- [x] animate
- [x] critique
- [x] audit
- [x] polish
- [x] distill
- [x] harden

---

## QA Commands Run

```bash
node scripts/verify-static-site.mjs
```

**Result:** All checks passed. See verification output for full details.

---

## Deployment Status

- **Method:** Git push to `claude/great-bardeen-g88jw1` → Vercel Git integration
- **Vercel config:** `vercel.json` present with headers and rewrite rules
- **Deploy URL:** See PR for Vercel preview URL (generated after push)

---

## Remaining Recommended Next Steps

1. **Add a real favicon** — Currently none. Use a simple VozViva™ wordmark or "VV" monogram SVG.
2. **Connect Vercel to custom domain** — e.g., `vozviva.com` or `vozviva.kupurimedia.com`
3. **Add real video examples** — Replace CSS mockup with actual VozViva-generated video samples
4. **Analytics** — Add Vercel Analytics or Plausible (privacy-first) for conversion tracking
5. **Contact form** — Replace `mailto:` CTAs with a proper form (Formspree, Resend, or Supabase)
6. **Open Graph image** — Create a real 1200×630 OG image for social sharing
7. **Stripe integration** — When ready, add payment links for each plan
8. **A/B test hero headline** — Consider testing two variants via Vercel Edge Config
9. **Accessibility audit** — Run axe-core or WAVE on the deployed URL
10. **Performance audit** — Run Lighthouse on deployed URL, target 90+ on mobile
