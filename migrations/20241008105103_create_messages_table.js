export const up = (knex) =>
  knex.schema.createTable("messages", (table) => {
    table.increments("message_id").primary();
    table
      .integer("sender_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("gro﻿up_id")
      .unsigned()
      .nullable()
      .references("group_id")
      .inTable("groups")
      .onDelete("CASCADE");
    table.text("content").nullable();
    table.string("image_path").nullable();
    table.timestamps(true, true);
  });

export const down = (knex) => knex.schema.dropTable("messages");
