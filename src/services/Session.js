import Parse from "@/services/Parse";

export default {
  currentUser() {
    const user = Parse.User.current();
    if (user) {
      return user.toJSON();
    }
    return null;
  },
  logout() {
    return Parse.User.logOut();
  }
};
