import { Router } from "express";
import UserController from "../controllers/user.controller";

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new User
    this.router.post("/", this.controller.create);
    // Retrieve a single User with id
    this.router.get("/:id", this.controller.getById);
    // Update a User with id
    this.router.put("/:id", this.controller.update);
    // Delete a User with id
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new UserRoutes().router;