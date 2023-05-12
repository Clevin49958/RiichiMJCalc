// next.config.js
const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  experimental: {
    swcPlugins: [
      [
        "next-superjson-plugin",
        {
          excluded: [],
        },
      ],
    ],
    esmExternals: true,
  },
};
