import bcrypt from "bcrypt";
import knex from "../knex.js";
import User from "../models/Users.js";
import dotenv from "dotenv";
import uploadAvatars from "../services/uploadAvatars.js";

dotenv.config();

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

  app.get(
    "/api/v1/users",
    { preValidation: [app.authenticate] },
    async (req, reply) => {
      try {
        const usersData = await User.getUsers();
        reply.send(usersData);
      } catch (err) {
        reply
          .status(500)
          .send({ error: "Failed to fetch users", details: err.message });
      }
    }
  );
  app.get(
    "/api/v1/user",
    { preValidation: [app.authenticate] },
    async (req, reply) => {
      try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
          return reply.status(401).send({ error: "Access denied" });
        }

        const decoded = app.jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.user_id;
        const usersData = await User.findById(userId);
        reply.send(usersData);
      } catch (err) {
        reply
          .status(500)
          .send({ error: "Failed to fetch users", details: err.message });
      }
    }
  );
  app.patch(
    "/api/v1/update-user/username/:id",
    { preValidation: [app.authenticate] },
    async (req, reply) => {
      const { id } = req.params;
      const { username } = req.body;
      console.log(id, username);

      if (!username) {
        return reply.status(400).send({ error: "Username is required" });
      }

      try {
        await User.updateUserName(id, username);
        reply.send({ success: true });
      } catch (err) {
        reply
          .status(500)
          .send({ error: "Failed to update username", details: err.message });
      }
    }
  );
  app.patch(
    "/api/v1/update-user/email/:id",
    { preValidation: [app.authenticate] },
    async (req, reply) => {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return reply.status(400).send({ error: "Email is required" });
      }

      try {
        await User.updateEmail(id, email);
        reply.send({ success: true });
      } catch (err) {
        reply
          .status(500)
          .send({ error: "Failed to update username", details: err.message });
      }
    }
  );
  app.patch(
    "/api/v1/update-user/password/:id",
    { preValidation: [app.authenticate] },
    async (req, reply) => {
      const { id } = req.params;
      const { password } = req.body;
      if (!password) {
        return reply.status(400).send({ error: "Email is required" });
      }

      try {
        await User.updatePassword(id, password);
        const usersData = await User.findById(id);
        console.log(usersData);
        const token = app.jwt.sign({
          user: { usersData },
        });

        reply.setCookie("token", token, {
          secure: true,
          sameSite: "Strict",
          path: "/",
        });
        reply.send({ success: true });
      } catch (err) {
        reply
          .status(500)
          .send({ error: "Failed to update username", details: err.message });
      }
    }
  );
  app.patch(
    "/api/v1/update-user/avatar/:id",
    { preValidation: [app.authenticate] },
    async (req, reply) => {
      const { id } = req.params;
      try {
        const newAvatarFileName = await uploadAvatars(id, req);
        // console.log(`Avatar Path: ${newAvatarFileName}`);
        // if (!newAvatarFileName) {
        //   return reply.status(500).send({ error: "Ошибка загрузки аватара" });
        // }
        // const newAvatarPath = `/uploads/avatars/${newAvatarFileName}`;
        // console.log(`User ID: ${id}`);
        // console.log(`Avatar Path: ${newAvatarPath}`);

        // // Проверка результата обновления в БД
        // const updateResult = await User.updateAvatar(id, newAvatarPath);
        // console.log(`Update Result: ${updateResult}`);

        reply.send({ success: true });
      } catch (err) {
        reply
          .status(500)
          .send({ error: "Failed to update username", details: err.message });
      }
    }
  );
};
