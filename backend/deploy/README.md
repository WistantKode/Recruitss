# Deploy Recruitsss backend (systemd + gunicorn)

Ce dossier contient tout le nécessaire pour déployer l'API Django en service systemd derrière Gunicorn.

## Prérequis
- Linux avec systemd (ex: Ubuntu 22.04+)
- Python 3.10+ et `python3-venv`
- PostgreSQL (DB et user existants)
- Redis (pour cache + Celery)
- Fichier `.env` configuré pour la prod (`DEBUG=False`, `ALLOWED_HOSTS`, SMTP, DB, Redis…)

Exemples d'installation (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y python3-venv postgresql redis-server
```

## Droits/Permissions du projet
Si le dépôt a été cloné par `root`, corriger la propriété pour l'utilisateur du service.
```bash
APP_DIR=/home/starland9-recruits/htdocs/recruits.starland9.dev/recruitsss/backend
SERVICE_USER=starland9-recruits
SERVICE_GROUP=starland9-recruits

sudo systemctl stop recruitsss || true
sudo chown -R "$SERVICE_USER:$SERVICE_GROUP" "$APP_DIR"
sudo mkdir -p "$APP_DIR/logs" "$APP_DIR/staticfiles" "$APP_DIR/media"
sudo chown -R "$SERVICE_USER:$SERVICE_GROUP" "$APP_DIR/logs" "$APP_DIR/staticfiles" "$APP_DIR/media"
```

## Installation du service (one‑time)
Installe et démarre le service systemd. Variables personnalisables:
- `SERVICE_NAME` (par défaut: `recruitsss`)
- `RUN_USER` / `RUN_GROUP` (utilisateur/groupe Linux qui exécuteront l'app)
- `BIND` (adresse Gunicorn; ex: `0.0.0.0:8002` ou socket Unix)

```bash
cd /home/starland9-recruits/htdocs/recruits.starland9.dev/recruitsss/backend
SERVICE_NAME=recruitsss \
RUN_USER=starland9-recruits \
RUN_GROUP=starland9-recruits \
BIND=0.0.0.0:8002 \
bash deploy/install_service.sh
```

Le script:
- crée/alimente le venv sous l'utilisateur cible
- installe les dépendances (requirements + gunicorn)
- génère et installe `/etc/systemd/system/<SERVICE_NAME>.service`
- `daemon-reload`, `enable` et `start` le service

## Déployer une nouvelle version
```bash
cd /home/starland9-recruits/htdocs/recruits.starland9.dev/recruitsss/backend
bash deploy/deploy.sh
```
Ce script met à jour les deps, exécute `migrate`, `collectstatic` et redémarre le service.

## Vérifier / Logs
```bash
sudo systemctl status recruitsss
sudo journalctl -u recruitsss -f
```

## Personnalisation rapide
- Port: changer `BIND=0.0.0.0:8002` lors de l'installation, ou éditer le service et `sudo systemctl daemon-reload && sudo systemctl restart recruitsss`.
- Env: modifiez `backend/.env` (secret key, hosts, DB/Redis, SMTP, CORS…).
- Static/Media: dossiers `staticfiles/` et `media/` doivent être accessibles en lecture par Nginx si utilisés.

## Nginx (optionnel)
Exemple si Gunicorn écoute sur `127.0.0.1:8002`:
```nginx
server {
	listen 80;
	server_name recruits.starland9.dev;

	location /static/ {
		alias /home/starland9-recruits/htdocs/recruits.starland9.dev/recruitsss/backend/staticfiles/;
	}

	location / {
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_pass http://127.0.0.1:8002;
	}
}
```
HTTPS: `sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d recruits.starland9.dev`

## Maintenance
- Redémarrer: `sudo systemctl restart recruitsss`
- Désactiver: `sudo systemctl disable --now recruitsss`
- Supprimer le service:
```bash
sudo systemctl disable --now recruitsss
sudo rm -f /etc/systemd/system/recruitsss.service
sudo systemctl daemon-reload
```

## PostgreSQL rapide (création)
Adapter au besoin si vous utilisez un user dédié (extrait):
```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE recruits WITH LOGIN PASSWORD 'UN_MOT_DE_PASSE_TRES_FORT';
CREATE DATABASE recruitsss OWNER recruits ENCODING 'UTF8' TEMPLATE template1;
GRANT ALL PRIVILEGES ON DATABASE recruitsss TO recruits;
SQL
```

## Dépannage courant
- Permission denied: corriger la propriété du dossier projet (`chown -R RUN_USER:RUN_GROUP`).
- Venv créé en root: supprimer `.venv` puis relancer `deploy/install_service.sh`.
- Port déjà utilisé: vérifier `ss -tuln | grep :8002` ou changer `BIND`.
- DEBUG=False: assurez `ALLOWED_HOSTS` et CORS corrects; reverse proxy en HTTPS conseillé.
