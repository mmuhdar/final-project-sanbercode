import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Booking from "App/Models/Booking";

export default class BookingsController {
  /**
   *
   * @swagger
   * /api/v1/bookings:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Booking
   *    summary:  Get all booking data in json
   *    responses:
   *      200:
   *        description:  success
   *      404:
   *        description: not found
   * /api/v1/bookings/{id}:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    tags:
   *      - Booking
   *    summary:  Get booking data and tenant by spesific id
   *    responses:
   *      200:
   *        description:  success
   *      404:
   *        description: not found
   * /api/v1/bookings/{id}/join:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    tags:
   *      - Booking
   *    summary:  Join game for just klik or send link with spesific booking id
   *    responses:
   *      200:
   *        description:  success. status join/unjoin ada di table booking_user.
   *      404:
   *        description: not found
   * /api/v1/bookings/{id}/unjoin:
   *  put:
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    tags:
   *      - Booking
   *    summary:  Cancel game for just klik or send link with spesific booking id
   *    responses:
   *      200:
   *        description:  success. status join/unjoin ada di table booking_user.
   *      404:
   *        description: not found
   * /api/v1/schedules:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Booking
   *    summary:  Get specific list booking with user login
   *    responses:
   *      200:
   *        description:  success
   *      404:
   *        description: not found
   *
   */
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
      const data = await Booking.query()
        .where("id", params.id)
        .preload("users");
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
    // const data = await Booking.query().where("id", params.id).preload("users");
    return response.ok({
      message: "Berhasil cancel game, status menjadi unjoin",
    });
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
