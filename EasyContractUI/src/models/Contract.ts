import ContractRecipient from "./ContractRecipient";

export default interface Contract{
    id?:number,
    title: string,
    templateId?: number,
    terms: string,
    date: string,
    status: string,
    recipient: ContractRecipient,
    auditTrail: [],
}

export interface auditTrail{
    id: number,
    action: string,
    date: string,
    contractId: number,
}
