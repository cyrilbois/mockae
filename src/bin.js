const fs = require('fs');
const { parseArgs } = require('util');
const path = require('path');
const DB = require ('./db.js');
const Controller = require('./controller.js');
const Service = require ('./service.js');
const { Rule, RuleOptions } = require ('./rule.js');
const createApp = require('./app.js');

function help() {
    console.log(`Usage: Mockae [options]

    Options:
            -p,  --port <port>        Port (default: 3000)
            -d, --database <file>    Database file (default: db.json)
            -r, --rule <file>        Rule file (default: rules.lua)
            --help                   Show this message
    `);
}

function args() {
    try {
        const options = {
            port: { type: 'string', short: 'p', default: process.env['PORT'] ?? '3000' },
            database: { type: 'string', short: 'd', default: process.env['DATABASE'] ?? path.join(__dirname, '..', 'db.json') },
            rule: { type: 'string', short: 'r', default: process.env['RULE'] ?? path.join(__dirname, '..', 'rules.lua') },
            help: { type: 'boolean' }
        };
        const args = parseArgs({ options });
        if (args.values.help) {
            help();
            process.exit()
        }
        return { 
            databasePath: args.values.database,
            rulePath: args.values.rule,
            port: parseInt(args.values.port)
        };
    } catch (e) {
        console.error(e.message);
        help();
        process.exit(1);
    }
}

const { databasePath, rulePath, port } = args();

if (!fs.existsSync(databasePath)) {
    console.error(`File ${databasePath} not found`);
    process.exit(1);
}
const db = DB.createFromFile(databasePath);

if (!fs.existsSync(rulePath)) {
    console.error(`File ${rulePath} not found`);
    process.exit(2);
}
const rule = Rule.createFromFile(rulePath);

const service = new Service(db);
const controller = new Controller(service);

const app = createApp(controller, rule);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
