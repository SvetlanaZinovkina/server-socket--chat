import bcrypt from "bcrypt";
import knex from "../knex.js";

const saltRounds = 6;

class User {
  static async create({ username, email, password }) {
    try {
      const existingUser = await knex("users").where({ email }).first();

      if (existingUser) {
        throw new Error("User with this email or username already exists");
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const [newUser] = await knex("users").insert({
        username,
        email,
        password_hash: hashedPassword,
      });

      return newUser;
    } catch (e) {
      throw new Error(e);
    }
  }
  static async findById(userId) {
    return await knex("users").where({ user_id: userId }).first();
  }

  static async findByEmail(email) {
    try {
      const user = await knex("users").where({ email: email }).first();
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      console.error(e);
      throw new Error(e.message || "Error finding user");
    }
  }

  static async checkPassword({ user, password }) {
    return await bcrypt.compare(password, user.password_hash);
  }
  static async getAll() {
    const users = await knex("users").select("user_id", "username");
    return users;
  }

  static async isAdmin({ userId }) {
    const user = await knex("users")
      .where({ id: Number(userId) })
      .first();
    return user && user.role === "admin";
  }
  static async findByCredentials(email, password) {
    // Ищем пользователя по username
    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new Error("Неверное имя пользователя или пароль");
    }

    // Сравниваем введенный пароль с хэшированным паролем в базе данных
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Неверное имя пользователя или пароль");
    }

    // Если все проверки пройдены, возвращаем пользователя
    return user;
  }
}

export default User;
