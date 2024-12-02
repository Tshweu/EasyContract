import { ContractRecipientService } from '../../services/ContractRecipientService';
import pool from '../../config/db';
import { ContractRecipient } from '../../models/ContractRecipient';
import { createTables, destroyTables } from '../../config/init';

describe('contractRecipient service tests', () => {
    let contractRecipient: ContractRecipient = {
        id: 1,
        name: 'jason',
        surname: 'jones',
        email: 'jason@gmail.com',
        idNumber: '78356373',
        contractId: 1
    };

    beforeAll(()=>{
        return createTables();
     })

     afterAll(() => {
        return destroyTables();
    });

    afterAll(() => {
        return pool.end();
    });

    test('should get contractRecipient by id', async () => {
        let contractRecipientService: ContractRecipientService = new ContractRecipientService(pool);

        const foundContractRecipient: ContractRecipient = await contractRecipientService.findContractRecipientById(1);
        expect(foundContractRecipient).toEqual(contractRecipient);
    });

    test('should update new contractRecipient', async () => {
        let contractRecipientService: ContractRecipientService = new ContractRecipientService(pool);

        contractRecipient.surname = "new surname";
        const affectedRows: number = await contractRecipientService.updateContractRecipientById(1,contractRecipient);
        expect(affectedRows).toBe(1);
    });

});
