import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Field from "App/Models/Field";

export default class FieldsController {
  public async index({ response }: HttpContextContract) {
    try {
      const data = await Field.all();
      return response.ok({ data });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = await Field.create({
        name: request.input("name"),
        type: request.input("type"),
        venueId: request.input("venue_id"),
      });
      return response.created({ message: "Field created!", data });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const data = await Field.query().where("id", params.id).preload("venues");
      return response.ok(data);
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      await Field.query()
        .where("id", params.id)
        .update({
          name: request.input("name"),
          type: request.input("type"),
          venue_id: request.input("venue_id"),
        });
      const data = await Field.findByOrFail("id", params.id);
      return response.status(201).json({ message: "Data updated!", data });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      await Field.query().where("id", params.id).delete();
      return response.ok({ meesage: "Data deleted!" });
    } catch (error) {
      return response.badRequest({ error: error.message });
    }
  }
}
