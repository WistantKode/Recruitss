#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "[deploy] Ensuring logs directory exists..."
mkdir -p logs

echo "[deploy] Installing dependencies (pnpm install)..."
pnpm install --frozen-lockfile

echo "[deploy] Building Next.js (pnpm build)..."
NODE_ENV=production pnpm build

echo "[deploy] Starting/Reloading with PM2..."
npx --yes pm2 startOrReload "$PROJECT_ROOT/deploy/ecosystem.config.js" --env production

echo "[deploy] Current PM2 status (recruitsss-frontend):"
npx --yes pm2 status recruitsss-frontend || true

echo "[deploy] Done. App should be available on port 3002."
