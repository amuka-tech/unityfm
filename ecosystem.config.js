module.exports = {
  apps: [
    {
      name: 'unitytv-web',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    },
    {
      name: 'unitytv-rtmp',
      script: 'node',
      args: 'scripts/local-rtmp-server.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
