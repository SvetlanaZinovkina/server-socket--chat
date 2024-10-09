import bcrypt from "bcrypt";
import knex from "../knex.js";
import User from "../models/Users.js";

export default (app) => {
  app.post("/api/v1/signup", async (req, reply) => {
    const { username, email, password } = req.body;
    try {
      const newUserId = await User.create({ username, email, password });
      console.log(newUserId);

      const newUser = await User.findById(newUserId);
      const { username: user, role, avatar_path } = newUser;
      const token = app.jwt.sign({ user: newUser });

      reply.setCookie("token", token, {
        secure: true,
        sameSite: "Strict",
        path: "/",
      });

      reply.status(200).send({
        token,
        newUserId,
        user,
        role,
        avatar_path,
        message: "User registered successfully",
      });
    } catch (err) {
      reply
        .status(500)
        .send({ error: "Registration failed", details: err.message });
    }
  });

  app.post("/api/v1/login", async (req, reply) => {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      console.log(user);
      if (user && (await bcrypt.compare(password, user.password_hash))) {
        const token = app.jwt.sign({ user });

        const { user_id, username, role, avatar_path } = user;

        reply.setCookie("token", token, {
          secure: true,
          sameSite: "Strict",
          path: "/",
        });

        reply.status(200).send({
          user_id,
          token,
          username,
          role,
          avatar_path,
          message: "Login successful",
        });
      } else {
        reply.status(401).send({ error: "Invalid email or password" });
      }
    } catch (err) {
      reply.status(500).send({ error: "Login failed", details: err.message });
    }
  });

  //   app.get(
  //     "/api/v1/user",
  //     { preValidation: [app.authenticate] },
  //     async (req, reply) => {
  //       const userId = req.user.user_id;
  //       try {
  //         const userData = await knex("users")
  //           .select("*")
  //           .where("user_id", userId)
  //           .first();
  //         reply.send(userData);
  //       } catch (err) {
  //         reply
  //           .status(500)
  //           .send({ error: "Failed to fetch purchases", details: err.message });
  //       }
  //     }
  //   );
  //   app.put(
  //     "/api/v1/user/username",
  //     { preValidation: [app.authenticate] },
  //     async (req, reply) => {
  //       const userId = req.user.user_id;
  //       const { username } = req.body;
  //       try {
  //         await knex("users").where("user_id", userId).update({ username });
  //         reply.send({ sucess: true });
  //       } catch (err) {
  //         reply
  //           .status(500)
  //           .send({ error: "Failed to update username", details: err.message });
  //       }
  //     }
  //   );
  //   app.put(
  //     "/api/v1/user/email",
  //     { preValidation: [app.authenticate] },
  //     async (req, reply) => {
  //       const userId = req.user.user_id;
  //       const { email } = req.body;
  //       try {
  //         await knex("users").where("user_id", userId).update({ email });
  //         reply.send({ sucess: true });
  //       } catch (err) {
  //         reply
  //           .status(500)
  //           .send({ error: "Failed to update email", details: err.message });
  //       }
  //     }
  //   );
  //   app.put(
  //     "/api/v1/user/password",
  //     { preValidation: [app.authenticate] },
  //     async (req, reply) => {
  //       const userId = req.user.user_id;
  //       const { oldPassword, newPassword } = req.body;

  //       try {
  //         const password = await knex("users")
  //           .select("password_hash")
  //           .where("user_id", userId);
  //         const isMatch = await bcrypt.compare(oldPassword, password);

  //         if (!isMatch)
  //           reply.status(400).send({ error: "Old pasword isn't correct" });

  //         const newHashedPassword = await bcrypt.hash(newPassword, 5);
  //         await knex("users")
  //           .where("user_id", userId)
  //           .update({ password_hash: newHashedPassword });

  //         reply.send({ sucess: true });
  //       } catch (err) {
  //         reply
  //           .status(500)
  //           .send({ error: "Failed to update passwword", details: err.message });
  //       }
  //     }
  //   );
};
