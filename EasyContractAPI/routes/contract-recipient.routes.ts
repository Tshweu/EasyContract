import { Router } from "express";
import ContractRecipientController from "../controllers/contract-recipient.controller";
import db from '../config/db';

class ContractRecipientRoutes {
  router = Router();
  controller = new ContractRecipientController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Retrieve a single ContractRecipient with id
    this.router.get("/:id", this.controller.getById);
    // Update a ContractRecipient with id
    this.router.put("/:id", this.controller.update);
  }
}

export default new ContractRecipientRoutes().router;