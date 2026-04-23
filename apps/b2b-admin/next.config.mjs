/**
 * The admin panels are served directly on their dev ports (3001 for B2C
 * admin, 3003 for B2B admin) now that we've retired the centralized
 * gateway in favour of subdomain-per-tenant routing on the B2C frontend.
 * No `basePath` is required — the app lives at the origin root.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  allowedDevOrigins: ['*.localhost'],
  transpilePackages: ['@igaming/ui', '@igaming/database'],
};

export default nextConfig;
