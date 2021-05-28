import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column.dateTime()
  public playDateStart?: DateTime;

  @column.dateTime()
  public playDateEnd?: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>;
}