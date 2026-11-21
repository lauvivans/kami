export default {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: ["**/dist/**", "packages/core/assets/css/**"],
  overrides: [
    {
      files: ["**/*.vue"],
      customSyntax: "postcss-html",
      rules: {
        // Vue's scoped-style selector.
        "selector-pseudo-class-no-unknown": [
          true,
          { ignorePseudoClasses: ["deep"] },
        ],
      },
    },
    {
      // ICSS :export blocks expose SCSS values to TypeScript.
      files: ["**/*.module.scss"],
      rules: {
        "selector-pseudo-class-no-unknown": [
          true,
          { ignorePseudoClasses: ["export"] },
        ],
        "property-no-unknown": null,
      },
    },
  ],
  rules: {
    // BEM: block__element--modifier, each part in kebab-case.
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
      {
        message: (selector: string) => `Expected class "${selector}" to be BEM`,
      },
    ],
  },
};
