module.exports = {
  apps: [
    {
      name: 'toss-v6',
      script: 'C:\\Users\\tlsdb\\OneDrive\\Desktop\\toss-3d-v6\\node_modules\\vite\\bin\\vite.js',
      args: '--port 5176 --host 0.0.0.0',
      cwd: 'C:\\Users\\tlsdb\\OneDrive\\Desktop\\toss-3d-v6',
      watch: false,
      autorestart: true,
      restart_delay: 3000,
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'toss-v6-tunnel',
      script: 'C:\\Users\\tlsdb\\AppData\\Roaming\\npm\\node_modules\\localtunnel\\bin\\lt.js',
      args: '--port 5176 --subdomain toss-v6-live',
      cwd: 'C:\\Users\\tlsdb\\OneDrive\\Desktop\\toss-3d-v6',
      watch: false,
      autorestart: true,
      restart_delay: 5000
    }
  ]
}
