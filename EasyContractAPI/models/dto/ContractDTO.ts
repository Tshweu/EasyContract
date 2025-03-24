import { ContractRecipient } from "../../entities/ContractRecipient";

export interface contractDTO {
    title: string;
    templateId: number;
    userId: number;
    recipient: ContractRecipient
}
