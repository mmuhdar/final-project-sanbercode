/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async ({ view }) => {
  return view.render("welcome");
});
// Route.get("/login", async ({ view }) => {
//   return view.render("login");
// });
// Route.get("/signup", async ({ view }) => {
//   return view.render("signup");
// });
// Route.get("/signup/confirmation", async ({ view }) => {
//   return view.render("verification");
// });
// Route.resource("venues", "VenuesController")
//   .apiOnly()
//   .middleware({
//     store: ["auth", "role"],
//     update: ["auth", "role"],
//     destroy: ["auth", "role"],
//   });

Route.get("/api/v1/venues", "VenuesController.index")
  .as("venues.index")
  .middleware(["auth", "verify"]);
Route.get("/api/v1/venues/:id", "VenuesController.show")
  .as("venues.show")
  .middleware(["auth", "verify"]);
Route.post("/api/v1/venue", "VenuesController.store")
  .as("venues.store")
  .middleware(["auth", "role"]);
Route.put("/api/v1/venue/:id", "VenuesController.update")
  .as("venues.update")
  .middleware(["auth", "role"]);
// Route.delete("/api/v1/venues/:id", "VenuesController.destroy")
//   .as("venues.destroy")
//   .middleware(["auth", "role"]);
Route.post("/api/v1/venues/:id/bookings", "VenuesController.bookingVenue")
  .as("venues.booking")
  .middleware(["auth", "verify"]);

// Route.resource("fields", "FieldsController").apiOnly();

Route.post("/api/v1/register", "UsersController.register").as("auth.register");
Route.post("/api/v1/otp-confirmation", "UsersController.otpConfirmation").as(
  "auth.verify"
);
Route.post("/api/v1/login", "UsersController.login").as("auth.login");
// Route.get("/api/v1/users", "UsersController.index").as("users.index");

Route.group(() => {
  Route.group(() => {
    Route.get("/bookings", "BookingsController.index")
      .middleware(["auth", "verify"])
      .as("bookings.index");
    Route.get("/bookings/:id", "BookingsController.show")
      .middleware(["auth", "verify"])
      .as("bookings.show");
    Route.post("/bookings/:id/join", "BookingsController.join")
      .middleware(["auth", "verify"])
      .as("bookings.join");
    Route.put("/bookings/:id/unjoin", "BookingsController.unjoin")
      .middleware(["auth", "verify"])
      .as("bookings.unjoin");
    Route.get("/schedules", "BookingsController.schedule")
      .middleware(["auth", "verify"])
      .as("bookings.schedule");
  }).prefix("/v1");
}).prefix("/api");
