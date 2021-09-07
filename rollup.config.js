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
    "src/webauthn-login.js",
    "src/webauthn-registration.js",
    "src/webauthn-recovery.js",
    "src/webauthn-enrollment-requester.js",
    "src/webauthn-enrollment-provider.js",
    "src/webauthn-rtc-enrollment-requester.js",
    "src/webauthn-rtc-enrollment-provider.js",
  ],
};
