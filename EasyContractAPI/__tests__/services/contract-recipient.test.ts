import { SignatoryService } from '../../services/signatory.service';
import pool from '../../config/db';
import { Signatory } from '../../entities/Signatory';
import { createTables, destroyTables } from '../../config/init';

describe('signatory service tests', () => {
    let signatory: Signatory = {
        id: 1,
        fullName: 'john jones',
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

    test('should get signatory by id', async () => {
        let signatoryService: SignatoryService = new SignatoryService(pool);

        const foundSignatory: Signatory = await signatoryService.findSignatoryById(1);
        expect(foundSignatory).toEqual(signatory);
    });

    test('should update new signatory', async () => {
        let signatoryService: SignatoryService = new SignatoryService(pool);

        signatory.fullName = "new surname";
        const affectedRows: number = await signatoryService.updateSignatoryById(1,signatory);
        expect(affectedRows).toBe(1);
    });

});
