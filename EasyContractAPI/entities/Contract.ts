import { Signatory } from './Signatory';
import { ContractAudit } from './ContractAudit';

export interface Contract {
    id?: number;
    title: string;
    terms: string;
    date: string;
    dueDate: string;
    dateSigned?: string | null;
    status: string;
    otp?: number | null;
    userId: number;
    recipient: Signatory;
    companyId: number;
    auditTrail?: ContractAudit[];
}
