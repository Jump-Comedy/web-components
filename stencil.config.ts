import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "web-components",
  buildEs5: true,
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
