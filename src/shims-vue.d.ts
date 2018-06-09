declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "vue-multiselect";
declare module "v-tooltip";

// https://webpack.js.org/guides/typescript/#importing-other-assets
declare module "*.svg" {
  const content: any;
  export default content;
}
