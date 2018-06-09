const jsf = require("./jsf");

const setSchema = {
  id: "ExerciseSet",
  exerciseId: {
    type: "integer",
    minimum: 1
  },
  weight: {
    type: "integer",
    minimum: 25,
    maximum: 405
  },
  reps: {
    type: "integer",
    minimum: 4,
    maximum: 12
  },
  rpe: {
    type: "integer",
    minimum: 5,
    maximum: 10
  },
  tempo: {
    type: "string"
  },
  restDuration: {
    type: "integer",
    minimum: 30,
    maximum: 120
  }
};

const exerciseSchema = {
  id: "Exercise",
  // temp, will be derived
  name: {
    type: "string"
  },
  exerciseId: {
    type: "integer",
    minimum: 1
  },
  notes: {
    type: "string"
  },
  sets: {
    type: "array",
    minItems: 3,
    maxItems: 3,
    items: setSchema
  }
};

const itemSchema = {
  id: "WorkoutSession",
  type: "object",
  properties: {
    workoutRoutineId: {
      type: "integer"
    },
    // Temp -- this will be derived from association
    workoutRoutineName: {
      type: "string",
      faker: "lorem.words"
    },
    name: {
      type: "string",
      faker: "lorem.words"
    },
    createddAt: {
      format: "date-time",
      type: "string"
    },
    updatedAt: {
      format: "date-time",
      type: "string"
    },
    startedAt: {
      format: "date-time",
      type: "string"
    },
    endedAt: {
      format: "date-time",
      type: "string"
    },
    exercises: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: exerciseSchema
    }
  },
  required: [
    "workoutRoutineId",
    "workoutRoutineName",
    "name",
    "startedAt",
    "createdAt",
    "updatedAt",
    "endedAt",
    "exercises"
  ]
};

const listSchema = {
  type: "array",
  minItems: 5,
  maxItems: 5,
  items: itemSchema
};

module.exports = jsf(listSchema);
