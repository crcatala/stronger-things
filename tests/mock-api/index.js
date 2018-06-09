const exercises = require("./exercises");
const workoutSessions = require("./workoutSessions");

module.exports = () => {
  const data = {
    exercises,
    workoutSessions,
    comments: [
      {
        id: 1,
        body: "some comment",
        postId: 1
      }
    ],
    profile: {
      name: "typicode"
    }
  };

  return data;
};
