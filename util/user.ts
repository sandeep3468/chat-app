interface User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  room: string;
}
const users: User[] = [];

const addUser = ({ id, firstName, lastName, room, userName }: User) => {
  firstName = firstName ? firstName.trim().toLowerCase() : "User";

  const existingUser = users.find(
    (user) => user.room === room && user.userName === userName
  );

  if (existingUser) {
    return { error: `'${firstName}' userName is already taken` };
  }

  const user = { id, firstName, room, userName, lastName };
  users.push(user);
  console.log("{user}", { user });
  return { user };
};

const removeUser = (id: number) => {
  const index = users.findIndex((user) => user.id === id);
  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id: number) => users.find((user) => user.id === id);

module.exports = { addUser, removeUser, getUser };
