const Service = require ('./service.js');

module.exports = class Controller {
    #service = null;
    constructor(service) {
        this.#service = service;
    }
    get(req, res, next) {
        const { resource = '', id = '' } = req.params;
        const item = this.#service.get(resource, id);
        if (item) {
            res.response.status(200).send(item);
        } else {
            res.response.status(404).send('Not Found');
        }
        next();
    }
    async create(req, res, next) {
        const { resource = '' } = req.params;
        let item = req.body;
        if (Service.isItem(item)) {
            if (! item.id) {
                item.id = Service.createId();
            }
            if (this.#service.get(resource, item.id)) {
                res.response.status(409).send("Already exists");
            } else {
                item = await this.#service.create(resource, item); 
                if (item) {
                    res.response.status(201).send(item);
                } else {
                    res.response.status(404).send('Not Found');
                }    
            }
        } else {
            res.response.status(400).send('Bad Request');
        }
        next();
    }
    async update(req, res, next, patch = false) {
        const { resource = '', id = '' } = req.params;
        if (Service.isItem(req.body)) {
            let item = this.#service.get(resource, id);
            if (item) {
                item = patch ? { ...item, ...req.body, id } : { ...req.body, id };
                await this.#service.update(resource, item);
                res.response.status(200).send(item);    
            } else {
                res.response.status(404).send('Not Found');
            }
        } else {
            res.response.status(400).send('Bad Request');
        }
        next();
    }
    async patch(req, res, next) {
        await this.update(req, res, next, true);
    }
    async delete(req, res, next, patch = false) {
        const { resource = '', id = '' } = req.params;
        const item = await this.#service.delete(resource, id); 
        if (item) {
            res.response.status(200).send(item);
        } else {
            res.response.status(404).send('Not Found');
        }    
        next();
    }
}
