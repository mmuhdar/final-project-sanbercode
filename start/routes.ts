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
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async ({ view }) => {
  return view.render("welcome");
});
Route.get("/login", async ({ view }) => {
  return view.render("login");
});
Route.get("/signup", async ({ view }) => {
  return view.render("signup");
});
Route.get("/signup/confirmation", async ({ view }) => {
  return view.render("verification");
});
Route.resource("venues", "VenuesController")
  .apiOnly()
  .middleware({ store: ["auth"], update: ["auth"], destroy: ["auth"] });

Route.post("/venues/:id/bookings", "VenuesController.bookingVenue")
  .as("venues.booking")
  .middleware("auth");

// Route.resource("fields", "FieldsController").apiOnly();

Route.post("/users", "UsersController.register").as("users.register");
Route.post("/users/verification", "UsersController.otpConfirmation").as(
  "users.verification"
);
Route.get("/users", "UsersController.index").as("users.index");
Route.post("/login", "UsersController.login").as("users.login");

Route.group(() => {
  Route.get("/bookings", "BookingsController.index");
  Route.get("/bookings/:id", "BookingsController.show");
  Route.post("/bookings/:id/join", "BookingsController.join").middleware(
    "auth"
  );
  Route.put("/bookings/:id/unjoin", "BookingsController.unjoin").middleware(
    "auth"
  );
  Route.get("/schedules", "BookingsController.schedule").middleware("auth");
});
