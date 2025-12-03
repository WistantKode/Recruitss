#!/usr/bin/env bash
set -euo pipefail

# This script deploys the Django app: install deps, migrate, collectstatic, restart service.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
SERVICE_NAME=${SERVICE_NAME:-recruitsss}

cd "${PROJECT_DIR}"

if [[ ! -x ".venv/bin/python" ]]; then
  echo "[!] Virtualenv not found at ${PROJECT_DIR}/.venv. Run deploy/install_service.sh first." >&2
  exit 1
fi

echo "[i] Using venv: ${PROJECT_DIR}/.venv"

".venv/bin/pip" install --upgrade pip
if [[ -f "requirements.txt" ]]; then
  ".venv/bin/pip" install -r requirements.txt
fi

echo "[i] Applying migrations"
".venv/bin/python" manage.py migrate --noinput

echo "[i] Collecting static files"
".venv/bin/python" manage.py collectstatic --noinput

echo "[i] Restarting systemd service: ${SERVICE_NAME}"
sudo systemctl restart "${SERVICE_NAME}"

echo "[i] Checking status"
sudo systemctl --no-pager --full status "${SERVICE_NAME}" || true

echo "[i] Tail logs (journalctl): use -> sudo journalctl -u ${SERVICE_NAME} -f"
echo "[✓] Deploy done"
