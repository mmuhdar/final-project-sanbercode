import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Verify {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let verify = auth.user?.isVerified;
    if (verify) {
      await next();
    } else {
      return response.unauthorized({
        message: "Akun anda belum terverifikasi!",
      });
    }
    await next();
  }
}
