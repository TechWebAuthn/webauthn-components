import * as fs from "fs";
import { terser } from "rollup-plugin-terser";

fs.rmdirSync("dist", { recursive: true });

const defaults = {
  output: {
    dir: "dist",
    format: "es",
    chunkFileNames: "utils/[name].js",
  },
  plugins: [terser()],
};

export default {
  ...defaults,
  input: [
    "src/web-authn-login.js",
    "src/web-authn-registration.js",
    "src/web-authn-recovery.js",
    "src/web-authn-enrollment-requester.js",
    "src/web-authn-enrollment-provider.js",
    "src/web-authn-rtc-enrollment-requester.js",
    "src/web-authn-rtc-enrollment-provider.js",
  ],
};
