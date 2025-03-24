import { Router } from "express";
import TemplateController from "../controllers/template.controller";
import verifyToken from "../helpers/token";
import Template2Controller from "../controllers/template2.controller";

class TemplateRoutes {
  router = Router();

  constructor(private controller: TemplateController) {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Template
    this.router.post("/",verifyToken, this.controller.create);
    //get all user templates
    this.router.get("/",verifyToken, this.controller.get);
    // Retrieve a single Template with id
    this.router.get("/:id",verifyToken, this.controller.getById);
    // Update a Template with id
    this.router.put("/:id",verifyToken, this.controller.update);
    // Delete a Template with id
    this.router.delete("/:id",verifyToken, this.controller.delete);
  }
}

export default TemplateRoutes;