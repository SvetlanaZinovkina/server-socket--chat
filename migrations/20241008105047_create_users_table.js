export const up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary();
    table.string("username", 50).notNullable().unique();
    table.string("email", 100).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table
      .string("avatar_path")
      .defaultTo("./uploads/default-avatar.svg")
      .notNullable();
    table.string("role", 50).defaultTo("user").notNullable();
    table.timestamps(true, true);
  });

export const down = (knex) => knex.schema.dropTable("users");
