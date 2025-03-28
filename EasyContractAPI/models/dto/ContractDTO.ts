import { ContractRecipient } from "../../entities/ContractRecipient";

export interface contractDTO {
    title: string;
    templateId: number;
    userId: number;
    companyId: number;
    recipient: ContractRecipient;
}
