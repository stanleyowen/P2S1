import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "out/**", "public/**", "server/**", "src/generated/**", "netlify/**"] },
  ...next,
];

export default config;
