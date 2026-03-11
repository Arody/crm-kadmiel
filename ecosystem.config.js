module.exports = {
  apps: [
    {
      name: "crm-kadmiel",
      cwd: "./.next/standalone/Developer/NEXT/crm-kadmiel",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3009,
        // Variables críticas que PM2 inyectará directamente al entorno Standalone de Next.js
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
