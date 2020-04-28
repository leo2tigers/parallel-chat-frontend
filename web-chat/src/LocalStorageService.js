let signIn = (user_id, username, curr_group_id) => {
  localStorage.setItem("user_id", user_id);
  localStorage.setItem("username", username);
  localStorage.setItem("current_group_id", curr_group_id);
};
let signOut = () => localStorage.clear();
let setCurrentGroup = curr_group_id => {
  localStorage.setItem("current_group_id", curr_group_id);
};
let getCurrentGroup = () => {
  return localStorage.getItem("current_group_id");
};
let getUsername = () => {
  return localStorage.getItem("username");
};
export { signIn, signOut, setCurrentGroup, getCurrentGroup, getUsername };
