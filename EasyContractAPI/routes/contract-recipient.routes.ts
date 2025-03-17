import { Router } from "express";
import ContractRecipientController from "../controllers/contract-recipient.controller";
import db from '../config/db';
import verifyToken from "../helpers/token";

class ContractRecipientRoutes {
  router = Router();

  constructor(private controller: ContractRecipientController) {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Retrieve a single ContractRecipient with id
    this.router.get("/:id",verifyToken, this.controller.getById);
    // Update a ContractRecipient with id
    this.router.put("/:id",verifyToken, this.controller.update);
  }
}

export default ContractRecipientRoutes;