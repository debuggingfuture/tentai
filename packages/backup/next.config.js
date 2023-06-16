const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,

  // https://stackoverflow.com/questions/72381805/mui-material-with-react-18-not-working-export-usecontext-imported-as-useco
  // webpack: (
  //   config,
  //   { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  // ) => {
  //   // Important: return the modified config
  //   config.resolve.alias.react = path.resolve(__dirname, "node_modules/react");
  //   return config;
  // },
};

module.exports = nextConfig;
