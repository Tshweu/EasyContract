import { Router } from "express";
import TemplateController from "../controllers/template.controller";

class TemplateRoutes {
  router = Router();
  controller = new TemplateController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Template
    this.router.post("/", this.controller.create);
    //get all user templates
    this.router.get("/", this.controller.get);
    // Retrieve a single Template with id
    this.router.get("/:id", this.controller.getById);
    // Update a Template with id
    this.router.put("/:id", this.controller.update);
    // Delete a Template with id
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new TemplateRoutes().router;