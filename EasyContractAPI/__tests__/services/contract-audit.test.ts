import { ContractAuditService } from '../../services/ContractAuditService';
import pool from '../../config/db';
import { ContractAudit } from '../../models/ContractAudit';
import { createTables, destroyTables } from '../../config/init';

describe('contract audit service tests', () => {
    const contractAudit: ContractAudit = {
        id: 1,
        action: 'Created New Contract',
        date: '2014-07-01 01:01:01',
        contractId: 1,
    };

    beforeAll(() => {
        return createTables();
    });

    afterAll(() => {
        return destroyTables();
    });
    
    afterAll(() => {
        return pool.end();
    });

    test('should get contractAudit by id', async () => {
        let contractAuditService: ContractAuditService =
            new ContractAuditService(pool);

        const foundContractAudit: ContractAudit =
            await contractAuditService.findContractAuditById(1);
        expect(foundContractAudit).toEqual(contractAudit);
    });
});