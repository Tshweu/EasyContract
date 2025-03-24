import { Router } from "express";
import UserController from "../controllers/user.controller";
import verifyToken from "../helpers/token";

class UserRoutes {
  router = Router();

  constructor(private controller: UserController) {
    this.intializeRoutes();
  }

  intializeRoutes = () => {
    // Create a new User
    this.router.post("/",verifyToken, this.controller.create);
    // Retrieve a single User with id
    this.router.get("/:id",verifyToken, this.controller.getById);
    // Update a User with id
    this.router.put("/:id",verifyToken, this.controller.update);
    // Delete a User with id
    this.router.delete("/:id",verifyToken, this.controller.delete);
  }
}

export default UserRoutes;