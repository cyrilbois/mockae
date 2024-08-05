const express = require('express');
const cors = require('cors');
const { RuleOptions } = require ('./rule.js');
const Response = require ('./response.js');

function createApp(controller, rule) {
    const app = express();

    app.use(cors()).options('*', cors())
    
    app.use(express.json());
    
    app.use(express.urlencoded({ extended: true }));
    
    app.use((req, res, next) => {
        res.response = new Response();
        next();
    });
    
    app.use((req, res, next) => {
        if (rule.isInvalid()) {
            res.status(500).send('Custom rules are invalid');
            return;
        }
        rule.apply(new RuleOptions(req, res));
        if (res.response.shouldExit()) {
            res.status(res.response.getStatus()).send(res.response.getResponse());
            return;
        }
        next();
    });
    
    app.get('/', (req, res) => {
        res.send('Mockae :)');
    });

    app.get('/:resource/:id', controller.get.bind(controller));

    app.post('/:resource', controller.create.bind(controller));

    app.put('/:resource/:id', controller.update.bind(controller));

    app.patch('/:resource/:id', controller.patch.bind(controller));

    app.delete('/:resource/:id', controller.delete.bind(controller));

    app.use((req, res) => {
        res.response.getHeaders().forEach((header) => res.set(header.name, header.value));
        res.status(res.response.getStatus()).send(res.response.getResponse());
    });

    app.use((err, req, res, next) => {
        if (err.code === 'ERR_HTTP_INVALID_STATUS_CODE') {
            res.status(500).send('Internal Server Error: Invalid status code');
        } else {
            res.status(500).send('Something broke!');
        }
    });
      
    return app;
}

module.exports = createApp;