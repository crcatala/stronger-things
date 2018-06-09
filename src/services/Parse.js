import Parse from "parse";

Parse.initialize("stronger-things");
Parse.serverURL = "https://stronger-things-parse.herokuapp.com/parse";

window.Parse = Parse;
export default Parse;
