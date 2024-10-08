import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const migrations = {
  directory: path.join(__dirname, "migrations"),
};

const development = {
  client: "mysql2",
  connection: {
    host: "45.12.239.121",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false, // Для тестов, но для продакшена настройте корректный сертификат
    },
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
  },
};

const production = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
  },
};

export default { development, production };
