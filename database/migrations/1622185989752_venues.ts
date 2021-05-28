import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Venues extends BaseSchema {
  protected tableName = "venues";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("phone").notNullable();
      table.string("address").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE");

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
