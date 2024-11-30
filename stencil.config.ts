import { Config } from "@stencil/core";
import "dotenv/config";

export const config: Config = {
  namespace: "web-components",
  env: {
    AMPLIFY_BASE_URL: process.env.AMPLIFY_BASE_URL,
  },
  outputTargets: [
    {
      type: "dist-custom-elements",
      customElementsExportBehavior: "auto-define-custom-elements",
      externalRuntime: false,
    },
    {
      type: "dist",
      esmLoaderPath: "../loader", // Creates a loader script
    },
  ],
  testing: {
    browserHeadless: "new",
  },
};
