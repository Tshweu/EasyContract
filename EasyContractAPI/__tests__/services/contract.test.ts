import { ContractService } from '../../services/ContractService';
import pool from '../../config/db';
import { Contract } from '../../models/Contract';
import { createTables, destroyTables } from '../../config/init';
import { DateTime } from 'luxon';
import { ContractRecipient } from '../../models/ContractRecipient';



describe('contract service tests', () => {
    let contract: Contract = {
        id: 2,
        title: 'The contract',
        terms: 'Hey how did you; sdlnsnan safjda; dsnna',
        completed: false,
        date: DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss'),
        userId: 1,
        status: 'new',
        otp: null,
    };
    let contractRecipient: ContractRecipient = {
        id: 2,
        name: 'test',
        surname: 'test',
        email: 'test@gmail.com',
        idNumber: '876834987434',
        contractId: 2,
    };

    beforeAll(() => {
        return createTables();
    });
    
    afterAll(() => {
        return destroyTables();
    });
    
    afterAll(()=>{
        return pool.end();
    })

    test('should create new contract', async () => {
        let contractService: ContractService = new ContractService(pool);
        const affectedRows: number = await contractService.createContract(
            contract,
            contractRecipient,
        );

        expect(affectedRows).toBe(1);
    });

    test('should get contract by id', async () => {
        let contractService: ContractService = new ContractService(pool);

        const foundContract: Contract = await contractService.findContractById(
            2,
        );
        expect(foundContract).toEqual(contract);
    });

    test('should update new contract', async () => {
        let contractService: ContractService = new ContractService(pool);

        contract.title = 'new title';
        const affectedRows: number = await contractService.updateContractById(
            2,
            contract,
        );
        expect(affectedRows).toBe(1);
    });

    test('should fail to create contract', async () => {
        let contractService: ContractService = new ContractService(pool);

        contractRecipient.name = "Should Fail";
        contract.userId = 0;
        try {
            const affectedRows = await contractService.createContract(
                contract,
                contractRecipient,
            );
            expect(affectedRows).toEqual(0);
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    
});