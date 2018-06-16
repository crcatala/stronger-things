import Parse from "parse";

Parse.initialize(process.env.VUE_APP_PARSE_APP_ID);
Parse.serverURL = process.env.VUE_APP_PARSE_SERVER_URL;

window.Parse = Parse;
export default Parse;
