import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Fields extends BaseSchema {
  protected tableName = "fields";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.enum("type", ["Futsal", "Basketball", "Volley"]);
      table
        .integer("venue_id")
        .unsigned()
        .notNullable()
        .references("venues.id")
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
