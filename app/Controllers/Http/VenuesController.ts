import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import VenueValidator from "App/Validators/VenueValidator";

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
}
