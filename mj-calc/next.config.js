// next.config.js
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
}