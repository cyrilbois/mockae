const fs = require('fs');
module.exports = class DB {
    static createFromFile(resourcesPath) {
        let db = new DB();
        db.resourcesPath = resourcesPath;
        db.data = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));
        return db;
    }
    static createFromData(data) {
        let db = new DB();
        db.data = data;
        return db;
    }
    constructor() {
        this.resourcesPath = null;
        this.data = [];
    }
    async write() {
        try {
            if (this.resourcesPath) {
                await fs.promises.writeFile(this.resourcesPath, JSON.stringify(this.resources), 'utf8');
            }
            return true;
        } catch (err) {
            return false;
        }
    }
};