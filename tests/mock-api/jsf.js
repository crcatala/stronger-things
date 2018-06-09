//
// JSON Schema Faker with Faker Extension
//
const jsf = require("json-schema-faker");
jsf.extend("faker", function() {
  return require("faker");
});

module.exports = jsf;
