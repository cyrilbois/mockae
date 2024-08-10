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
    static paginate(array, page, limit) {
        if (page == null && limit == null) {
            return array;
        }
        page = page != null ? parseInt(page) : 1;
        limit = limit != null ? parseInt(limit) : 10;
        if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
            return [];
        }
        const startIndex = (page - 1) * limit;
        return startIndex < array.length ? array.slice(startIndex, startIndex + limit) : [];
    }
    get(name, id, query = {}) {      
        const resource = this.#db.data[name];
        if (Array.isArray(resource)) {
            if (id) {
                const item = resource.find((item) => item['id'] === id);
                if (item) {
                    return item;
                }    
            } else {
                return Service.paginate(resource, query.page, query.limit);
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
