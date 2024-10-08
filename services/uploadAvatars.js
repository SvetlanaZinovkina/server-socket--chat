import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import knex from '../knex.js';

const uploadAvatars = async (req) => {
    await knex.transaction(async (trx) => {
        try {
        const data = await req.file();
  
        // Проверяем, что файл был отправлен
        if (!data) {
          return reply.status(400).send({ error: "Файл не был загружен" });
        }
        const __dirname = fileURLToPath(path.dirname(import.meta.url));
        // Указываем путь для сохранения файла
        const uploadPath = path.join(__dirname,'..', 'uploads','/', 'avatars', data.filename);
    
        // Создаем поток для записи файла
        const fileStream = fs.createWriteStream(uploadPath);
    
        // Записываем файл
        await data.file.pipe(fileStream);
    
        // После загрузки возвращаем ответ
        return uploadPath;
    
      } catch (err) {
        reply.status(500).send({ error: "Ошибка загрузки файла", details: err.message });
      }
    })
    await trx.commit();
}

export default uploadAvatars;
