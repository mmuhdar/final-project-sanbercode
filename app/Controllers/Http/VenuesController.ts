import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import Booking from "App/Models/Booking";
import VenueValidator from "App/Validators/VenueValidator";
import Field from "App/Models/Field";

export default class VenuesController {
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
      const newVenue = venueId.$attributes;
      const dataField = {
        name: ["Futsal", "Mini Soccer", "Soccer", "Basketball", "Volleyball"],
        type: ["futsal", "minisoccer", "soccer", "basketball", "volleyball"],
      };
      console.log(dataField);
      await Field.create({
        name: request.input("name"),
        type: request.input("type"),
        venueId: newVenue.id,
      });

      const booking = await Booking.create({
        playDateStart: request.input("play_date_start"),
        playDateEnd: request.input("play_date_end"),
      });
      const authUser = auth.user;
      await authUser?.related("bookings").save(booking);
      return response.created({ message: "Success booking venue!" });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }
}
