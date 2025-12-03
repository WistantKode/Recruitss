/* PM2 ecosystem config for Next.js production server */
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

module.exports = {
  apps: [
    {
      name: 'recruitsss-frontend',
      cwd: projectRoot,
      script: path.join(projectRoot, 'node_modules/next/dist/bin/next'),
      args: 'start -p 3002',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      merge_logs: true,
      out_file: path.join(projectRoot, 'logs/out.log'),
      error_file: path.join(projectRoot, 'logs/error.log'),
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
