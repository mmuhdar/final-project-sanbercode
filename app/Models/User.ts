import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Venue from "./Venue";
import Booking from "./Booking";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public role: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Venue)
  public venues: HasMany<typeof Venue>;

  @manyToMany(() => Booking)
  public bookings: ManyToMany<typeof Booking>;
}
