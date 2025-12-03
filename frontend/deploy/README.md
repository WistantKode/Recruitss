# Déploiement PM2 (One-Click)

Ce dossier contient la configuration PM2 et un script de déploiement “one-click” pour lancer l’application Next.js en production sur le port `3002`.

## Fichiers
- `ecosystem.config.js` : configuration PM2 (cluster, logs, port).
- `deploy.sh` : script “one-click” qui installe, build et démarre/relance l’app via PM2.

## Prérequis
- Node.js 18+
- pnpm
- Accès réseau au port `3002`
- Variables de prod dans `./.env.production`

## Utilisation

Option A — via script npm/pnpm
```bash
pnpm deploy
```

Option B — exécuter le script directement
```bash
bash deploy/deploy.sh
```

Le script va :
- créer le dossier `logs/` (si absent)
- `pnpm install --frozen-lockfile`
- `pnpm build` (avec `NODE_ENV=production`)
- `pm2 startOrReload deploy/ecosystem.config.js --env production`

## Logs et statut
```bash
npx pm2 status recruitsss-frontend
npx pm2 logs recruitsss-frontend
```

## Notes
- Le serveur écoute sur le port `3002`. Assurez-vous que `NEXTAUTH_URL` (si utilisé publiquement) et votre reverse-proxy pointent vers ce port.
- PM2 est invoqué via `npx --yes pm2` pour éviter une installation globale. Vous pouvez installer PM2 globalement si vous préférez :
```bash
npm i -g pm2
```
- Pour redémarrer après une mise à jour :
```bash
pnpm deploy
```