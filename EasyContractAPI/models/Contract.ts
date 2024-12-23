import { ContractRecipient } from './ContractRecipient';
import { ContractAudit } from './ContractAudit';

export interface Contract {
    id?: number;
    title: string;
    terms: string;
    date: string;
    status: string;
    completed: boolean;
    otp?: number | null;
    userId: number;
    recipient: ContractRecipient
}
