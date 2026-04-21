/**
 * `basePath` is sourced from `NEXT_PUBLIC_BASE_PATH` so the same build can
 * run behind the local proxy gateway, staging, or a plain-root production
 * domain without code changes. Falling back to `''` keeps `next dev` /
 * `next start` happy when the var is unset (e.g. CI previews).
 *
 * We reuse the same `NEXT_PUBLIC_*` name (rather than a private var) so
 * client components can read the identical value via `process.env` — Next
 * inlines `NEXT_PUBLIC_*` at build time, giving us zero-runtime-cost
 * symmetry between server and browser.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  allowedDevOrigins: ['muratbosnak'],
};
export default nextConfig;
