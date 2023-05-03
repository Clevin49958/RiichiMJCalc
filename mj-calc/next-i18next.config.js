module.exports = {
  i18n: {
    // These are all the locales you want to support in
    // your application
    debug: process.env.NODE_ENV === "development",
    locales: ["en", "zh"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en",
    /** To avoid issues when deploying to some paas (vercel...) */
    localePath:
      typeof window === "undefined"
        ? require("path").resolve("./public/locales")
        : "/locales",
    reloadOnPrerender: process.env.NODE_ENV === "development",
    returnNull: false,
  },
};
