# GenOS / GenStudio Backlog — wiring the AI chat for real

Status: **prep done, waiting on Intuit-side access**
Date filed: 2026-05-06
Owner: Will

---

## Why this is parked

To make `/chat` actually talk like Will's digital twin, the website backend needs to call a Claude model. Two viable paths exist:

1. **Personal Anthropic API key** — fast, costs ~$5–20/mo on Will's card, but puts an internal-employee-facing AI tool on personal billing. Probably not aligned with Intuit policy.
2. **Intuit's internal Claude access via GenOS / GenStudio** — sanctioned, fully covered by the Intuit ↔ Anthropic partnership, no personal billing, future-proof. **Preferred.**

We chose path 2. Discovery / approval at Intuit takes effort that wasn't worth blocking the build on, so we shipped a **placeholder-ready chat experience** and parked the backend wiring for later.

---

## What's already built (so picking this back up is fast)

- `/chat` page in the React portal, full UI: avatar, message bubbles, input, send button, "AI twin" badge.
- A Cloudflare-Worker-shaped backend stub at `worker/` (separate deploy).
- The Worker already knows how to:
  - Fetch `digital-twin.md` from GitHub on cold start and use it as the system prompt
  - Accept `POST /chat` with `{ messages: [...] }`
  - Return placeholder text today; one config change swaps in the real model call.
- One environment variable controls the swap: `LLM_PROVIDER` (currently `mock`, will become `genos` or `anthropic`).
- See [`worker/README.md`](../worker/README.md) for the wiring map and the exact line that needs to change.

So when access is sorted, the work is roughly: paste credentials into the Worker, change `LLM_PROVIDER`, push.

---

## What "GenOS" / "GenStudio" is (cached so we don't re-research)

Intuit's internal Generative AI Operating System. Public sources confirm:

- **GenOS** — the platform overall.
- **GenStudio** — the developer-facing layer that exposes a model catalog *including Claude via AWS Bedrock*.
- **GenRuntime** — runtime/serving layer.
- Claude is offered through GenOS courtesy of the Intuit ↔ Anthropic partnership announced Feb 2026.

External references:

- Intuit Newsroom — [Intuit Introduces Generative AI Operating System](https://investors.intuit.com/news-events/press-releases/detail/61/intuit-introduces-generative-ai-operating-system-with-custom-trained-financial-large-language-models)
- Intuit Newsroom — [Intuit Accelerates Development Velocity with GenOS Enhancements](https://investors.intuit.com/news-events/press-releases/detail/1210/intuit-accelerates-development-velocity-with-major-enhancements-to-proprietary-generative-ai-operating-system-genos)
- Constellation Research — [Intuit embraces LLM choice for multiple use cases](https://www.constellationr.com/blog-news/insights/intuit-embraces-llm-choice-multiple-use-cases) (notes Claude via AWS Bedrock in GenStudio)
- Anthropic case study — [Intuit + Anthropic one-sheet (PDF)](https://assets.anthropic.com/m/4a6432620ded694e/original/Anthropic-Intuit-case-study-one-sheeters.pdf)

---

## How to find the right person at Intuit (when ready)

**In rough order of speed:**

1. **Slack search** for channels containing: `genos`, `genstudio`, `gen-ai`, `gen-runtime`, `ai-platform`, `llm`, `bedrock`. Most internal AI platforms have `#genos-help`-style channels.
2. **Internal wiki / Confluence** — search "GenOS onboarding", "GenStudio access", "Bedrock access". Self-serve docs likely exist.
3. **IT service catalog (ServiceNow or equivalent)** — search "GenOS access", "AI platform access". Self-service request forms common at Intuit's scale.
4. **Design-org AI/Design-Tech partner** — most large design orgs at Intuit have one; they'll know who handles internal AI tools for designers.
5. **Engineering manager / skip-level** — needs to sign off on infra anyway.
6. **InfoSec / Privacy partner** — should be looped in for an AI chatbot serving employees, even if it's just personal bio. Search "AI Use Approval" or "AI risk review".

---

## The ask, ready to paste

> Hi — I'm a designer (Will Wang, will_wang@intuit.com) building a small internal-facing personal portal where teammates can read my work and chat with an AI version of me. The "twin" is a markdown system prompt I maintain on GitHub. I'd like to wire the chat to a Claude model.
>
> What's the supported path through GenOS / GenStudio (or Bedrock) to get an API endpoint I can call from a static web app's backend (a small serverless function)? Specifically:
> 1. Is there self-serve onboarding for an internal-employee-facing chat app, or does it need an AI use review first?
> 2. Which model would you recommend? (Claude Sonnet seems right for cost/quality.)
> 3. Any required logging / privacy steps before going live?
>
> Happy to share the system prompt and the use case — it's a personal-portfolio chatbot, no PII, no customer data, just my professional bio + design philosophy.

---

## What I need back from GenOS to finish wiring

When access is granted, capture these (then drop them into the Worker secrets — never into the repo):

- [ ] Endpoint URL for Claude (Bedrock / GenStudio gateway)
- [ ] Auth method (token? IAM signature? OAuth?)
- [ ] Required headers (e.g. `Intuit-Tid`, model id, app id)
- [ ] Model identifier string (e.g. `anthropic.claude-sonnet-...`)
- [ ] Any rate / quota guidance
- [ ] Whether requests must originate from Intuit infra (which would change deploy strategy — see "Decision to revisit" below)

---

## Decisions to revisit when un-parking

1. **Where does the Worker live?**
   - Cloudflare Workers (current plan): public internet, fast, free tier covers internal traffic. Works if GenOS endpoints are reachable from public internet with token auth.
   - Intuit-internal hosting (e.g. an internal serverless / API Gateway): required if GenOS only allows calls from inside the corporate network. Means GitHub Pages stays as the frontend, but backend moves inside Intuit. Frontend code unchanged — only the URL it POSTs to changes.

2. **Auth on the chat itself.** Right now `/chat` is open to anyone with the URL. Decide before launch whether it should be Intuit-SSO-gated. Options: leave open (low-risk for a portfolio bot), put it behind Cloudflare Access + Intuit IDP, or move the whole site behind an internal-only host.

3. **Rate limiting / abuse.** Add a simple per-IP cap in the Worker before going wide. Easy 5-line addition.

4. **Logging.** Decide what to log (prompt? response? identity?). Likely no logging beyond error counts to keep this simple and privacy-clean.

---

## Definition of done (for the un-parking task)

- `LLM_PROVIDER` env var set to `genos` (or `anthropic` if we ever fall back)
- Real model call replaces the placeholder responder
- Streaming works end-to-end (typing effect in the UI)
- A teammate can hit the live URL, send a message, get a real response in Will's voice
- README updated to reflect that chat is live
- `Research/genos-backlog.md` updated with "Resolved on YYYY-MM-DD" and archived
