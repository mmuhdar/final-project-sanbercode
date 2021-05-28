import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class BookingUsers extends BaseSchema {
  protected tableName = "booking_user";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE");
      table
        .integer("booking_id")
        .unsigned()
        .references("bookings.id")
        .onDelete("CASCADE");

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
