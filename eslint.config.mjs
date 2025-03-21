import globals from "globals";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginReact.configs.flat.recommended,
  {
    "plugins": {pluginReact},
    "rules": {
      "react/prop-types": "off",
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  }
];