import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class BookingUser extends BaseSchema {
  protected tableName = "booking_user";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string("status").defaultTo("join");
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("status");
    });
  }
}
