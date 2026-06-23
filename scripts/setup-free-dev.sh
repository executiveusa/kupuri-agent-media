#!/usr/bin/env bash
# Setup script for free local development environment
# Run from the repo root: bash scripts/setup-free-dev.sh

set -euo pipefail

echo "=== VozViva Free Dev Setup ==="
echo ""
echo "This script configures two things:"
echo "  1. free-claude-code proxy (for Claude Code CLI — text LLM calls via Groq)"
echo "  2. .env.local for VozViva web app (HF_TOKEN + GROQ_API_KEY)"
echo ""

# ── 1. free-claude-code proxy setup ─────────────────────────────────────────
FCC_DIR="$(dirname "$0")/../free-claude-code"

if [ ! -d "$FCC_DIR" ]; then
  echo "Cloning free-claude-code..."
  git clone https://github.com/Alishahryar1/free-claude-code.git "$FCC_DIR"
fi

if [ ! -f "$FCC_DIR/.env" ]; then
  echo ""
  read -p "Enter your Groq API key (free at console.groq.com): " GROQ_KEY
  cat > "$FCC_DIR/.env" <<EOF
# free-claude-code .env — configured for Groq (free tier)
GROQ_API_KEY="${GROQ_KEY}"
MODEL=groq/llama-3.3-70b-versatile
ANTHROPIC_AUTH_TOKEN=freecc
FCC_OPEN_BROWSER=false
ENABLE_MODEL_THINKING=false
MESSAGING_PLATFORM=none
EOF
  echo "Created $FCC_DIR/.env"
fi

# Check for Python / uv
if command -v uv &>/dev/null; then
  echo ""
  echo "Installing free-claude-code dependencies with uv..."
  (cd "$FCC_DIR" && uv sync)
  echo ""
  echo "To start the proxy:  cd free-claude-code && uv run fcc-server"
  echo "The proxy will listen on http://localhost:8082"
else
  echo ""
  echo "NOTE: 'uv' not found. Install it with:"
  echo "  curl -LsSf https://astral.sh/uv/install.sh | sh"
  echo "Then: cd free-claude-code && uv sync && uv run fcc-server"
fi

# ── 2. VozViva .env.local setup ─────────────────────────────────────────────
VOZVIVA_ENV="$(dirname "$0")/../.env.local"

if [ ! -f "$VOZVIVA_ENV" ]; then
  echo ""
  read -p "Enter your HuggingFace token (free at hf.co/settings/tokens): " HF_TOK
  read -p "Enter your Groq API key (same one as above, or press Enter to reuse): " GROQ_KEY2
  GROQ_KEY2="${GROQ_KEY2:-$GROQ_KEY}"

  SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://your-project.supabase.co}"
  SUPABASE_ANON="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-your-anon-key}"
  SUPABASE_SRV="${SUPABASE_SERVICE_ROLE_KEY:-your-service-role-key}"

  cat > "$VOZVIVA_ENV" <<EOF
# VozViva local dev — free tier configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SRV}

# Free video generation
HF_TOKEN=${HF_TOK}
GROQ_API_KEY=${GROQ_KEY2}

# No paid keys needed for the free provider
# REPLICATE_API_TOKEN=
# HEYGEN_API_KEY=
# OPENAI_API_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
  echo "Created .env.local"
fi

echo ""
echo "=== Done! ==="
echo ""
echo "Start VozViva:          npm run dev"
echo "Start proxy (optional): cd free-claude-code && uv run fcc-server"
echo ""
echo "In the dashboard, choose 'Demo Gratis' provider — it's 100% free."
