#!/usr/bin/env bash
set -euo pipefail

# This script installs and starts the systemd service for the Django app.
# It fills placeholders in the service template and deploys it under /etc/systemd/system.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Defaults (can be overridden via env or flags)
SERVICE_NAME=${SERVICE_NAME:-recruitsss}
RUN_USER=${RUN_USER:-$(whoami)}
RUN_GROUP=${RUN_GROUP:-$(id -gn)}
BIND=${BIND:-0.0.0.0:8002}

TEMPLATE_FILE="${SCRIPT_DIR}/${SERVICE_NAME}.service.template"
GENERATED_FILE="/tmp/${SERVICE_NAME}.service"
TARGET_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

echo "[i] Service name: ${SERVICE_NAME}"
echo "[i] Run as: ${RUN_USER}:${RUN_GROUP}"
echo "[i] Project dir: ${PROJECT_DIR}"
echo "[i] Gunicorn bind: ${BIND}"

if [[ ! -f "${TEMPLATE_FILE}" ]]; then
  echo "[!] Template not found: ${TEMPLATE_FILE}" >&2
  exit 1
fi

# Check that the target user can write into the project directory
if ! sudo -u "${RUN_USER}" test -w "${PROJECT_DIR}"; then
  echo "[!] ${RUN_USER} n'a pas les droits d'écriture sur ${PROJECT_DIR}." >&2
  echo "    Corrigez avec: sudo chown -R ${RUN_USER}:${RUN_GROUP} ${PROJECT_DIR}" >&2
  exit 1
fi

# Ensure virtualenv and dependencies (as RUN_USER)
if [[ ! -x "${PROJECT_DIR}/.venv/bin/python" ]]; then
  echo "[i] Virtualenv not found, creating at ${PROJECT_DIR}/.venv (as ${RUN_USER})"
  sudo -u "${RUN_USER}" python3 -m venv "${PROJECT_DIR}/.venv"
fi

echo "[i] Installing Python dependencies (requirements + gunicorn) as ${RUN_USER}"
sudo -u "${RUN_USER}" "${PROJECT_DIR}/.venv/bin/pip" install --upgrade pip
if [[ -f "${PROJECT_DIR}/requirements.txt" ]]; then
  sudo -u "${RUN_USER}" "${PROJECT_DIR}/.venv/bin/pip" install -r "${PROJECT_DIR}/requirements.txt"
fi
sudo -u "${RUN_USER}" "${PROJECT_DIR}/.venv/bin/pip" install gunicorn

# Ensure runtime directories exist and are owned by RUN_USER
sudo mkdir -p "${PROJECT_DIR}/logs" "${PROJECT_DIR}/staticfiles" "${PROJECT_DIR}/media"
sudo chown -R "${RUN_USER}:${RUN_GROUP}" "${PROJECT_DIR}/logs" "${PROJECT_DIR}/staticfiles" "${PROJECT_DIR}/media"

echo "[i] Generating service file from template"
sed \
  -e "s|__USER__|${RUN_USER}|g" \
  -e "s|__GROUP__|${RUN_GROUP}|g" \
  -e "s|__PROJECT_DIR__|${PROJECT_DIR}|g" \
  -e "s|__BIND__|${BIND}|g" \
  "${TEMPLATE_FILE}" > "${GENERATED_FILE}"

echo "[i] Copying service to ${TARGET_FILE} (sudo required)"
sudo cp "${GENERATED_FILE}" "${TARGET_FILE}"
sudo chmod 644 "${TARGET_FILE}"

echo "[i] Reloading systemd daemon"
sudo systemctl daemon-reload

echo "[i] Enabling and starting service ${SERVICE_NAME}"
sudo systemctl enable --now "${SERVICE_NAME}"

echo "[i] Service status (short):"
sudo systemctl --no-pager --full status "${SERVICE_NAME}" || true

echo "[i] Tail logs (journalctl): use -> sudo journalctl -u ${SERVICE_NAME} -f"
echo "[✓] Installation complete"
