# Project Instructions for Claude

## Stack

Next.js 14 App Router, TypeScript strict, Supabase (auth + storage + DB), Tailwind-free CSS, deployed to Vercel.

## Dev commands

```bash
npm run dev      # start dev server
npm run build    # type-check + build
npm run lint     # eslint
```

## Key rules

- Never instantiate SDK clients (`new OpenAI()`, `createClient()`, `new Replicate()`) at module scope — always inside function bodies to avoid Next.js build-time crashes.
- `lib/video/providers/free.ts` uses HuggingFace Inference API (FLUX.1-schnell + MMS-TTS Spanish) + Groq for scripts.
- Supabase storage bucket `vozviva-media` must exist (run `supabase/migrations/002_storage.sql`).

---

## Real Claude Code Router / CCR Protocol

CCR means Claude Code Router from `musistudio/claude-code-router`.

CCR is a real local routing layer for Claude Code. It can route Claude Code requests to configured providers/models, apply request/response transformers, support dynamic model switching, run a local Web UI, and support project-level routing rules.

CCR is not the same as Free Claude Code / FCC.

Use CCR when:
- the user explicitly says "use ccr"
- the user explicitly says "use claude-code-router"
- FCC is unavailable
- FCC is blocked
- CCR is already installed/configured
- Claude Code needs routing through OpenRouter, Gemini, DeepSeek, Ollama, OpenAI-compatible APIs, or another configured provider
- the user says "switch" and FCC is unavailable but CCR is available

---

### CCR SOURCE

CCR source package:
- GitHub repo: `musistudio/claude-code-router`
- npm package: `@musistudio/claude-code-router`
- CLI command: `ccr`

Do not install random forks unless the user explicitly approves.

---

### CCR INSTALL CHECK

Before installing, check whether CCR and Claude Code are already available.

macOS/Linux:
```bash
command -v ccr || true
command -v claude || true
node --version || true
npm --version || true
```

Windows PowerShell:
```powershell
Get-Command ccr -ErrorAction SilentlyContinue
Get-Command claude -ErrorAction SilentlyContinue
node --version
npm --version
```

If CCR is missing and the user requested CCR, install only after confirming the environment is safe.

Required baseline:
- Node.js >= 18
- Claude Code installed
- API key or local model provider available

Install Claude Code if missing:
```bash
npm install -g @anthropic-ai/claude-code
```

Install CCR:
```bash
npm install -g @musistudio/claude-code-router
```

Verify:
```bash
ccr --version
claude --version
```

Do not use `sudo` unless the user explicitly approves.

---

### CCR CONFIG LOCATION

Global CCR config file:
```
~/.claude-code-router/config.json
```

Do not put this file inside the project repo.
Do not commit this config.
Do not put real secrets in committed files.
Use environment variables for provider keys.

Accepted secret placeholder patterns:
```
$OPENROUTER_API_KEY
${OPENROUTER_API_KEY}
$GOOGLE_API_KEY
${GOOGLE_API_KEY}
$DEEPSEEK_API_KEY
${DEEPSEEK_API_KEY}
$OPENAI_API_KEY
${OPENAI_API_KEY}
```

Never print full API keys. Never echo secrets. Never write secrets into README, AGENTS.md, package scripts, source files, docs, or CI files.

---

### CCR BASIC CONFIG TEMPLATE

When creating a starter CCR config, prefer a safe local-only host. Use this as a template only — adapt provider/model names to currently available user-approved providers.

```json
{
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "LOG": true,
  "LOG_LEVEL": "info",
  "API_TIMEOUT_MS": 600000,
  "Providers": [
    {
      "name": "openrouter",
      "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
      "api_key": "$OPENROUTER_API_KEY",
      "models": [
        "qwen/qwen3-coder:free",
        "google/gemini-2.0-flash-exp:free"
      ],
      "transformer": {
        "use": ["openrouter"]
      }
    },
    {
      "name": "gemini",
      "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
      "api_key": "$GOOGLE_API_KEY",
      "models": [
        "gemini-2.5-flash",
        "gemini-2.5-pro"
      ]
    },
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "$DEEPSEEK_API_KEY",
      "models": [
        "deepseek-chat",
        "deepseek-reasoner"
      ],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": {
          "use": ["tooluse"]
        }
      }
    },
    {
      "name": "ollama",
      "api_base_url": "http://localhost:11434/v1/chat/completions",
      "api_key": "ollama",
      "models": [
        "qwen2.5-coder:latest"
      ]
    }
  ],
  "Router": {
    "default": "openrouter,qwen/qwen3-coder:free",
    "background": "openrouter,qwen/qwen3-coder:free",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "gemini,gemini-2.5-pro",
    "longContextThreshold": 60000
  }
}
```

Important:
- Model names change. Free models change. Provider support changes. Tool-calling support varies by model/provider.
- If a model fails, check available models and pick a working user-approved replacement.
- Do not assume any free model is permanently available.

---

### CCR START RULE

When CCR Switch Mode is activated:
1. Check config exists.
2. Check keys are present as environment variables.
3. Start or verify the router.
4. Detect the actual running port.
5. Confirm routing before editing repo code.

```bash
ccr start                   # start CCR
ccr start --daemon          # start as daemon if terminal would otherwise block
ccr start --port 3456       # start on a specific port only when needed
ccr status                  # check status
ccr ui                      # open the Web UI
ccr code                    # run Claude Code through CCR
ccr restart                 # restart after config changes
ccr stop                    # stop CCR
```

Do not assume the port. Detect it from one of:
- `ccr status`
- server startup output
- `~/.claude-code-router/config.json`
- Web UI output
- router logs

Common ports may include `3456` or `8080`, but the active config/output wins.

---

### CCR ACTIVATE RULE

CCR can output environment variables so external Claude-compatible tools route through the local router.

```bash
eval "$(ccr activate)"
```

After activation, the shell can route `claude` through CCR directly, provided the CCR service is running.

Do not add this permanently to `.zshrc`, `.bashrc`, or shell profile unless the user approves. If adding permanently is approved, add `eval "$(ccr activate)"` then source the shell config or open a new terminal.

Required condition: CCR service must be running before activated Claude-compatible commands can route through it.

---

### CCR MODEL MANAGEMENT

```bash
ccr model list                        # list configured models
ccr model                             # interactive model selector
ccr model set <provider>,<model>      # set default model
ccr model add <provider>,<model>      # add model
ccr model remove <provider>,<model>   # remove model
```

Inside Claude Code, dynamic model switching may use:
```
/model provider_name,model_name
```

Do not claim model switching worked unless the router status/logs or command result confirms it.

---

### CCR PROJECT-LEVEL ROUTING

CCR supports project-level routing. Use it when one repo should use cheap/local/long-context/reasoning models by policy.

Project-level config location:
```
~/.claude/projects/<project-id>/claude-code-router.json
```

Find project ID: `ccr status` or `cat ~/.claude.json`

Example:
```json
{
  "Router": {
    "default": "openrouter,qwen/qwen3-coder:free",
    "background": "openrouter,qwen/qwen3-coder:free",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "gemini,gemini-2.5-pro"
  }
}
```

Configuration priority: Custom router function > Project-level config > Global config > Built-in routing rules.

Never create project-level config inside the repo. Never commit it.

---

### CCR CUSTOM ROUTER RULE

CCR supports a custom router file:
```json
{ "CUSTOM_ROUTER_PATH": "/path/to/custom-router.js" }
```

The custom router must export an async function that receives the request and config and returns `"provider_name,model_name"` or `null` to fall back to default routing. Only use a custom router when the task requires advanced routing logic.

---

### CCR SUBAGENT ROUTING RULE

For Claude Code subagents, CCR can route a subagent to a specific provider/model by placing this at the start of the subagent prompt:
```
<CCR-SUBAGENT-MODEL>provider,model</CCR-SUBAGENT-MODEL>
```

Use subagent routing for cheap background reviews, docs generation, test triage, code search summaries, long-context analysis, separate security review.

Do not route high-risk security/auth/payment/database decisions to weak or unknown models.

---

### CCR NON-INTERACTIVE / CI RULE

For GitHub Actions, Docker, CI, or any non-interactive agent environment, set:
```json
{ "NON_INTERACTIVE_MODE": true }
```

When using CCR in automation: do not expose secrets in logs, use CI secrets, avoid interactive prompts, start router in the background, verify status before running Claude Code, stop/clean up when the job ends.

Example automation startup:
```bash
nohup ccr start --daemon &
ccr status
```

---

### CCR SECURITY RULES

Never expose or print: OpenRouter keys, Gemini/Google keys, DeepSeek keys, OpenAI keys, Anthropic keys, Groq keys, local API keys, router API keys, `.env` contents, or shell history containing secrets.

Never commit: `~/.claude-code-router/config.json`, `~/.claude/projects/<project-id>/claude-code-router.json`, logs containing prompts or secrets, real provider keys, generated local router configs, or shell profile files with real keys.

Never bind CCR to `0.0.0.0` unless the user explicitly approves and understands the network exposure. Default host: `127.0.0.1`.

Free-tier access does not mean unlimited usage.

---

### CCR SWITCH CONFIRMATION

After every CCR switch attempt, send one of these messages.

**Success:**
```
CCR SWITCH CONFIRMED

Mode:
- Active router: Claude Code Router
- Active runner: ccr code or claude via ccr activate
- Proxy status: running
- Router URL: [detected local URL]
- Provider/model: [detected provider/model or unknown]
- Config: ~/.claude-code-router/config.json
- Repo: [current repo path]
- Safety: no secrets exposed

Next:
- I will route this repo session through CCR and continue with the existing repo safety rules.
```

**Partial:**
```
CCR SWITCH PARTIAL

Mode:
- Active router: Claude Code Router
- Active runner: [ccr code | claude via activate | unknown]
- Proxy status: [running | not confirmed | config missing | key missing]
- Router URL: [detected local URL or unavailable]
- Provider/model: [detected provider/model or unknown]
- Config: [config path or missing]
- Repo: [current repo path]
- Safety: no secrets exposed

Next:
- [one exact action needed to finish CCR setup]
```

**Blocked:**
```
CCR SWITCH BLOCKED

Mode:
- Active router: direct fallback
- Active runner: [current runner or unknown]
- Proxy status: not running
- Router URL: unavailable
- Provider/model: unknown
- Config: [missing | invalid | inaccessible]
- Repo: [current repo path]
- Safety: no secrets exposed

Blocker:
- [exact blocker]

Next:
- [exact command or user action needed to complete CCR setup]
```

Never silently switch. Never claim CCR is active unless `ccr status`, `ccr code`, `ccr activate`, startup output, or logs confirm it.

---

### CCR FALLBACK RULE

If CCR fails:
1. Report the exact blocker.
2. Try FCC if available and the user did not require CCR-only mode.
3. Use direct provider fallback only if safe.
4. Preserve the ability to retry CCR later.

If the user says "CCR only," stop after the blocked confirmation and do not continue repo work until CCR is working.

---

### CCR + REPO RULES

CCR changes only the model route. CCR does not change repo safety rules. For repo/code work, still obey all standard coding rules: small patches, test/build/lint validation, no secrets in committed files.

**Compact add-on:**
```
If I say "switch," first try FCC. If FCC is unavailable, switch through the real Claude Code Router from musistudio/claude-code-router. Check `ccr`, `ccr --version`, `ccr status`, and `~/.claude-code-router/config.json`. Start with `ccr start` or `ccr start --daemon`, launch Claude through `ccr code`, use `ccr ui` for configuration, use `ccr model list` / `ccr model set <provider>,<model>` for model management, and use `eval "$(ccr activate)"` only when the user approves shell routing. Detect the actual port from config/status/output; do not hardcode 3456 or 8080. Never silently switch. Always send CCR SWITCH CONFIRMED / PARTIAL / BLOCKED before continuing. Never expose keys, never commit router config, and keep all repo safety rules active.
```
