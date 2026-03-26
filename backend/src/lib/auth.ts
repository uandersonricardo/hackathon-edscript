import type User from "./user";

class Auth {
  public static users: User[] = [];

  public static login(username: string, password: string) {
    const user = Auth.users.find((user) => user.username === username && user.password === password);

    if (!user) {
      throw "User not found";
    }

    return user;
  }

  public static register(user: User) {
    if (Auth.users.find((u) => u.username === user.username || u.id === user.id || u.email === user.email)) {
      throw "User already registered";
    }

    Auth.users.push(user);
  }

  public static findUser(id: string) {
    return Auth.users.find((user) => user.id === id);
  }
}

export default Auth;
