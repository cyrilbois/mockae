const Service = require('./service');
const DB = require('./db.js');
const crypto = require('crypto');

jest.mock('crypto');

describe('Service', () => {
    let db;
    let service;

    beforeEach(() => {
        db = DB.createFromData({});
        service = new Service(db);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('isItem', () => {
        it('should return true for objects', () => {
            expect(Service.isItem({})).toBe(true);
        });

        it('should return false for non-objects', () => {
            expect(Service.isItem([])).toBe(false);
            expect(Service.isItem(null)).toBe(false);
            expect(Service.isItem('string')).toBe(false);
            expect(Service.isItem(23)).toBe(false);
            expect(Service.isItem(false)).toBe(false);
        });
    });

    describe('createId', () => {
        it('should create a random ID', () => {
            const mockId = 'abcdef';
            crypto.randomBytes.mockReturnValue(Buffer.from(mockId, 'hex'));
            expect(Service.createId()).toBe(mockId);
        });
    });

    describe('get', () => {
        it('should return an item by id', () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];
            const item = service.get('test', '2');
            expect(item).toEqual({ id: '2', name: 'Item 2' });
        });

        it('should return null if item not found', () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }];
            const item = service.get('test', '2');
            expect(item).toBeNull();
        });

        it('should return all items', () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];
            const item = service.get('test', null);
            expect(item).toEqual([{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }]);
        });

        it('should return all items with a limit of 2', () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }, { id: '3', name: 'Item 3' }];
            const item = service.get('test', null, {limit: 2});
            expect(item).toEqual([{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }]);
        });
        it('should return all items on page 2 (default 10)', () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }, { id: '3', name: 'Item 3' }, { id: '4', name: 'Item 4' }, { id: '5', name: 'Item 5' }, { id: '6', name: 'Item 6' }, { id: '7', name: 'Item 7' }, { id: '8', name: 'Item 8' }, { id: '9', name: 'Item 9' }, { id: '10', name: 'Item 10' }, { id: '11', name: 'Item 11' }, { id: '12', name: 'Item 12' }];
            const item = service.get('test', null, {page: 2});
            expect(item).toEqual([ { id: '11', name: 'Item 11' }, { id: '12', name: 'Item 12' }]);
        });
        it('should return all items on page 3 with a limit of 1', () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }, { id: '3', name: 'Item 3' }, { id: '4', name: 'Item 4' }];
            const item = service.get('test', null, {page: 3, limit: 1});
            expect(item).toEqual([{ id: '3', name: 'Item 3' }]);
        });
    });

    describe('create', () => {
        it('should add a new item and write to the database', async () => {
            db.data['test'] = [];
            const newItem = { id: '1', name: 'Item 1' };
            const createdItem = await service.create('test', newItem);
            expect(db.data['test']).toContain(newItem);
            expect(createdItem).toEqual(newItem);
        });
    });

    describe('update', () => {
        it('should update an existing item and write to the database', async () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }];
            const updatedItem = { id: '1', name: 'Updated Item' };
            const result = await service.update('test', updatedItem);
            expect(db.data['test']).toContain(updatedItem);
            expect(result).toEqual(updatedItem);
        });
    });

    describe('delete', () => {
        it('should delete an existing item and write to the database', async () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }];
            const result = await service.delete('test', '1');
            expect(db.data['test']).not.toContain({ id: '1', name: 'Item 1' });
            expect(result).toEqual({ id: '1', name: 'Item 1' });
        });

        it('should return null if item does not exist', async () => {
            db.data['test'] = [{ id: '1', name: 'Item 1' }];
            const result = await service.delete('test', '2');
            expect(result).toBeNull();
        });
    });
});