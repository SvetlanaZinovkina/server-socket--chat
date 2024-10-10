import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import knex from "../knex.js";
import User from "../models/Users.js";

const uploadAvatars = async (id, req) => {
  await knex.transaction(async (trx) => {
    try {
      const data = await req.file();
      if (!data) {
        return reply.status(400).send({ error: "Файл не был загружен" });
      }
      const __dirname = fileURLToPath(path.dirname(import.meta.url));
      const uploadPath = path.join(
        __dirname,
        "..",
        "uploads",
        "/",
        "avatars",
        data.filename
      );

      const fileStream = fs.createWriteStream(uploadPath);

      await new Promise((resolve, reject) => {
        data.file.pipe(fileStream);
        data.file.on("end", resolve);
        data.file.on("error", reject);
      });
      const newAvatarPath = `uploads/${data.filename}`;
      await User.updateAvatar(id, newAvatarPath);
      await trx.commit();
    } catch (err) {
      throw new Error(err.message);
    }
  });
};

export default uploadAvatars;
