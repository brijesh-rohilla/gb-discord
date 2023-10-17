/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_NAME: 'GB Discord',
    NEXT_PUBLIC_APP_URL: 'sahdajo.domcloud.io',
    SPREADSHEET_ID: '1rCfLC4NmwKfDpHTpNuOsZyN-wR8Me9DFwHGbPUUu2QY',
  },
};

module.exports = nextConfig;
