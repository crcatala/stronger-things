const jsf = require("./jsf");

// const exerciseNames = [
//   "Bench Press",
//   "Deadlift",
//   "Squat",
//   "Shoulder Press",
//   "Calf Raise"
// ];

const itemSchema = {
  id: "Exercise",
  type: "object",
  properties: {
    id: {
      type: "integer",
      minimum: 1,
      autoIncrement: true
    },
    name: {
      type: "string",
      faker: "lorem.words"
      // faker: {
      //   "random.arrayElement": [exerciseNames]
      // }
    },
    category: {
      type: "string",
      faker: "lorem.word"
    },
    avatar: {
      type: "string",
      faker: "image.avatar"
    },
    recordValue: {
      type: "integer",
      minimum: 25,
      maximum: 405
    },
    recordReps: {
      type: "integer",
      minimum: 4,
      maximum: 12
    }
  },
  required: [
    //
    "id",
    "name",
    "category",
    "avatar",
    "recordValue",
    "recordReps"
  ]
};

const listSchema = {
  type: "array",
  minItems: 5,
  maxItems: 5,
  items: itemSchema
};

module.exports = jsf(listSchema);
