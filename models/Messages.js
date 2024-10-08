import knex from "../knex.js";

class Messages {
  static async create({ text, image, userId, dialogId, groupId }) {
    try {
      if (!text && !image) {
        throw new Error("Сообщение не может быть пустым!");
      }

      const [newMessage] = await knex("messages")
        .insert({
          content: text || null,
          image_path: image || null,
          sender_id: userId,
          dialog_id: dialogId,
          group_id: groupId,
        })
        .returning("*");

      return newMessage;
    } catch (error) {
      throw new Error(`Ошибка при создании сообщения: ${error.message}`);
    }
  }
}

export default Messages;
