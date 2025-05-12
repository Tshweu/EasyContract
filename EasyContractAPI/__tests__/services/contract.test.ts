import { ContractService } from '../../services/contract.service';
import pool from '../../config/db';
import { Contract } from '../../entities/Contract';
import { createTables, destroyTables } from '../../config/init';
import { DateTime } from 'luxon';
import { Signatory } from '../../entities/Signatory';
import { ContractStats } from '../../entities/ContractStats';

describe('contract service tests', () => {

    let signatory: Signatory = {
        id: 2,
        fullName: 'test test',
        email: 'test@gmail.com',
        idNumber: '876834987434',
        contractId: 2,
    };

    let contract: Contract = {
        id: 2,
        title: 'The contract',
        terms: 'Hey how did you; sdlnsnan safjda; dsnna',
        date: DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss'),
        dueDate: DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss'),
        userId: 1,
        status: 'new',
        otp: null,
        recipient: signatory,
        companyId: 1
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
            signatory,
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

    test('should get contract stats', async () => {
        let contractService: ContractService = new ContractService(pool);

        const foundContract: ContractStats | null = await contractService.findStats(
            1,
        );
        expect(foundContract).toBeTruthy();
    });

    test('should get all user contracts', async () => {
        let contractService: ContractService = new ContractService(pool);

        const foundContracts: Contract[] | null = await contractService.findAll(
            1,
        );
        expect(foundContracts).toBeTruthy();
        expect(foundContracts.length).toBeGreaterThan(0);
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

        signatory.name = "Should Fail";
        contract.userId = 0;
        try {
            const affectedRows = await contractService.createContract(
                contract,
                signatory,
            );
            expect(affectedRows).toEqual(0);
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    
});
