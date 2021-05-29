import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserValidator from "App/Validators/UserValidator";
import { schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Mail from "@ioc:Adonis/Addons/Mail";

export default class UsersController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(UserValidator);
      const newUser = await User.create(data);

      const otp_code = Math.floor(100000 + Math.random() * 900000);
      await Database.table("otp_codes").insert({
        otp_code,
        user_id: newUser.id,
      });
      await Mail.send((message) => {
        message
          .from("admin@todo.com")
          .to(data.email)
          .subject("Email Verification")
          .htmlView("email/otp_verification", {
            title: "OTP Verification",
            email: data.email,
            otp_code,
          });
      });
      return response.created({
        message: "success register, please verify your otp code!",
      });
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
  public async login({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
    });
    try {
      await request.validate({ schema: userSchema });
      const email = request.input("email");
      const password = request.input("password");
      const token = await auth.use("api").attempt(email, password);
      return response.ok({ message: "login success!", token });
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
  public async otpConfirmation({ request, response }: HttpContextContract) {
    const otp_code = request.input("otp_code");
    const email = request.input("email");

    let user = await User.findBy("email", email);
    const otpCheck = await Database.from("otp_codes")
      .where("otp_code", otp_code)
      .first();
    let userId = user?.$attributes.id;
    if (userId == otpCheck.user_id) {
      await User.query().where("id", userId).update({ is_verified: true });
      return response.ok({ message: "Berhasil konfirmasi OTP!" });
    } else {
      return response.status(400).json({
        message: "Gagal verifikasi OTP!",
      });
    }
  }
}
