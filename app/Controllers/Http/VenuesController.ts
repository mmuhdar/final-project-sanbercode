import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import Booking from "App/Models/Booking";
import VenueValidator from "App/Validators/VenueValidator";
import Field from "App/Models/Field";

export default class VenuesController {
  /**
   * @swagger
   * /api/v1/venues:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Venue
   *    summary:  Get all venue data in json
   *    responses:
   *      200:
   *        description:  success
   *      404:
   *        description: not found
   * /api/v1/venue:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Venue
   *    summary:  Create venue
   *    requestBody:
   *      required: true
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              address:
   *                type: string
   *              phone:
   *                type: string
   *            required:
   *              - name
   *              - address
   *              - phone
   *    responses:
   *      200:
   *        description:  success
   *      404:
   *        description: not found
   * /api/v1/venues/{id}:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    tags:
   *      - Venue
   *    summary:  Get venues by specific id
   *    responses:
   *      200:
   *        description:  success
   *      404:
   *        description: not found
   * /api/v1/venues/{id}/bookings:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    tags:
   *      - Venue
   *    summary:  Booking Venue
   *    requestBody:
   *      required: true
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                description: This field for choose name in field database
   *              type:
   *                type: string
   *                description: This field for choose type in field database
   *              play_date_start:
   *                type: datetime
   *              play_date_end:
   *                type: datetime
   *            required:
   *              - name
   *              - type
   *    responses:
   *      201:
   *        description:  Success Booking
   *      404:
   *        description: not found
   *      400:
   *        description: bad request
   * /api/v1/venue/{id}:
   *  put:
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - in: path
   *        name: id
   *        required: true
   *    tags:
   *      - Venue
   *    summary:  Update venue
   *    requestBody:
   *      required: true
   *      content:
   *        application/x-www-form-urlencoded:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              address:
   *                type: string
   *              phone:
   *                type: string
   *            required:
   *              - name
   *              - address
   *              - phone
   *    responses:
   *      201:
   *        description:  Success Booking
   *      404:
   *        description: not found
   *      400:
   *        description: bad request
   *
   */

  public async index({ response }: HttpContextContract) {
    try {
      const data = await Venue.all();
      return response.ok({ data });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(VenueValidator);
    const newVenue = new Venue();
    newVenue.name = data.name;
    newVenue.phone = data.phone;
    newVenue.address = data.address;
    const authUser = auth.user;
    await authUser?.related("venues").save(newVenue);
    response.created({
      message: "Berhasil create data!",
      data: newVenue,
    });
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const data = await Venue.query().where("id", params.id).preload("users");
      return response.ok({ data });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const data = await Venue.query()
        .where("id", params.id)
        .update({
          name: request.input("name"),
          address: request.input("address"),
          phone: request.input("phone"),
        });
      return response.ok({ message: "Data updated!", data });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      await Venue.query().where("id", params.id).delete();
      return response.ok({ message: "Data deleted!" });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }
  public async bookingVenue({
    request,
    response,
    params,
    auth,
  }: HttpContextContract) {
    try {
      const venueId = await Venue.findByOrFail("id", params.id);
      // const dataField = {
      //   name: ["Futsal", "Mini Soccer", "Soccer", "Basketball", "Volleyball"],
      //   type: ["futsal", "minisoccer", "soccer", "basketball", "volleyball"],
      // };
      // console.log(dataField);
      const fieldId = await Field.create({
        name: request.input("name"),
        type: request.input("type"),
        venueId: venueId.id,
      });

      const booking = await Booking.create({
        playDateStart: request.input("play_date_start"),
        playDateEnd: request.input("play_date_end"),
        fieldId: fieldId.id,
      });
      const authUser = auth.user;
      await authUser?.related("bookings").save(booking);
      return response.created({ message: "Success booking venue!" });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }
}
