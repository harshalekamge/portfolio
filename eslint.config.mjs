import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: [".next/**", "node_modules/**"] },
  // page-to-page links are plain <a> on purpose: a full load resets the scroll and motion libraries cleanly
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
];
export default config;
