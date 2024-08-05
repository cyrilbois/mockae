const fs = require('fs');
const fsPromises = require('fs/promises');
const crypto = require('crypto');

module.exports = class Service {
    #db = null;
    constructor(db) {
        this.#db = db;
    }
    static isItem(obj)  {
        return obj?.constructor === Object;
    }
    static createId() {
        return crypto.randomBytes(3).toString('hex');
    }
    get(name, id) {      
        const resource = this.#db.data[name];
        if (Array.isArray(resource)) {
            const item = resource.find((item) => item['id'] === id);
            if (item) {
                return item;
            }
        }
        return null;
    }
    async create(name, item) {
        if (!Array.isArray(this.#db.data[name])) {
            this.#db.data[name] = [];
        }
        this.#db.data[name].push(item);
        await this.#db.write();
        return item;
    }
    async update(name, item) {
        const oldItem = this.get(name, item.id);
        const index = this.#db.data[name].indexOf(oldItem);
        this.#db.data[name].splice(index, 1, item);
        await this.#db.write();
        return item;
    }
    async delete(name, id) {
        const item = this.get(name, id);
        if (item) {
            const index = this.#db.data[name].indexOf(item);
            this.#db.data[name].splice(index, 1);
            await this.#db.write();
            return item;
        }
        return null;
    }
};
