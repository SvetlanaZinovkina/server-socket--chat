// import isAdmin from "../middleware/isAdmin.js";
import User from "../models/Users.js";

export default (app) => {
  app.get(
    "/api/v1/admin/users",
    { preHandler: [app.authenticate] }, // Аутентификация и проверка роли
    async (req, reply) => {
      try {
        // console.log("Decoded Token:", req.user.user);
        // Получаем role из токена
        const { role } = req.user.user; // Предполагаем, что роль находится в токене
        // Проверяем, является ли пользователь администратором
        if (role !== "admin") {
          return reply.status(403).send({ error: "Доступ запрещен" }); // Возвращаем ошибку доступа
        }

        // Здесь вызовите метод для получения всех пользователей
        const users = await User.getAll();
        reply.send(users); // Отправляем список пользователей
      } catch (err) {
        reply
          .status(500)
          .send({ error: "Ошибка сервера", details: err.message }); // Возвращаем ошибку
      }
    }
  );
};
