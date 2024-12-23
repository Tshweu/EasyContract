import ContractRecipient from "./ContractRecipient";

export default interface Contract{
    id?:number,
    title: string,
    templateId?: number,
    terms: string,
    date: string,
    completed: boolean,
    status: string,
    recipient: ContractRecipient
}