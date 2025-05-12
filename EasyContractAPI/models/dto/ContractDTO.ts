import { Signatory } from "../../entities/Signatory";

export interface contractDTO {
    title: string;
    templateId: number;
    userId: number;
    companyId: number;
    recipient: Signatory;
}
