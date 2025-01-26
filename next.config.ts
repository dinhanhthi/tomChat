import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  //   trailingSlash: true, // use "/about/" instead of "/about" (not supported yet by --turbo)
  poweredByHeader: false, // remove "Powered by Next.js" from the header
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/devIndicators
  devIndicators: {
    appIsrStatus: false
  },

  // https://github.dev/lobehub/lobe-chat
  // when external packages in dev mode with turbopack, this config will lead to bundle error
  // serverExternalPackages: isProd ? ['@electric-sql/pglite'] : undefined

  // https://pglite.dev/docs/bundler-support#next-js
  transpilePackages: [
    '@electric-sql/pglite-react', // Optional
    '@electric-sql/pglite'
  ]
}

export default nextConfig
