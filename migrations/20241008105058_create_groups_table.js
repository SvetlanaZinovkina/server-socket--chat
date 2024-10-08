export const up = (knex) =>
  knex.schema.createTable("groups", (table) => {
    table.increments("group_id").primary();
    table.string("group_name").nullable();
    table.enum("group_type", ["private", "public"]).defaultTo("private");
    table.timestamps(true, true);
  });

export const down = (knex) => knex.schema.dropTable("groups");
