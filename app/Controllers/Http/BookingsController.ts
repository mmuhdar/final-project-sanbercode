import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Booking from "App/Models/Booking";

export default class BookingsController {
  public async index({ response }: HttpContextContract) {
    try {
      const data = await Booking.query().preload("users");
      return response.ok(data);
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const data = Booking.query().where("id", params.id).preload("users");
      return response.ok(data);
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async join({ response, params, auth }: HttpContextContract) {
    const bookingId = await Booking.findByOrFail("id", params.id);
    await Database.table("booking_user").insert({
      user_id: auth.user?.id,
      booking_id: bookingId.id,
    });
    const data = await Booking.query().where("id", params.id).preload("users");
    return response.ok({ message: "berhasil join booking", data });
  }

  public async unjoin({ response, params, auth }: HttpContextContract) {
    const bookingId = await Booking.findByOrFail("id", params.id);
    const authUser: any = auth.user?.id;
    await Database.from("booking_user")
      .where("user_id", authUser)
      .andWhere("booking_id", bookingId.id)
      .update({
        status: "unjoin",
      });
    const data = await Booking.query().where("id", params.id).preload("users");
    return response.ok({ message: "berhasil unjoin booking", data });
  }
  public async schedule({ response, auth }: HttpContextContract) {
    const authUser: any = auth.user?.id;
    const data = await Database.from("bookings")
      .where("user_id", authUser)
      .join("booking_user", "bookings.id", "=", "booking_user.booking_id")
      .select("*");
    return response.ok(data);
  }
}
