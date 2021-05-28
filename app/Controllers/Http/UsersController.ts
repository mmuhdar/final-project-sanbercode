import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";

export default class UsersController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(UserValidator);
      const newUser = await User.create(data);
      return response.created({ message: "User is created!", data: newUser });
    } catch (error) {
      // error for auth message
      if (error.guard) {
        return response.badRequest({
          message: "Login error!",
          error: error.message,
        });
        // error fro validator message
      } else {
        return response.badRequest({
          message: "Login error!",
          error: error.messages,
        });
      }
    }
  }
  public async index({ response }: HttpContextContract) {
    const data = await User.query().preload("venues");
    return response.ok({ data });
  }
}
