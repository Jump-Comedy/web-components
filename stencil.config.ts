import { Config } from "@stencil/core";
import "dotenv/config";

export const config: Config = {
  namespace: "web-components",
  env: {
    AMPLIFY_BASE_URL: process.env.AMPLIFY_BASE_URL,
  },
  buildEs5: true,
  outputTargets: [
    {
      type: "dist-custom-elements",
      customElementsExportBehavior: "auto-define-custom-elements",
      externalRuntime: false,
    },
    {
      type: "dist",
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};
