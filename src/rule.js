const fs = require('fs');
const luainjs = require('lua-in-js');

class RuleOptions {
    #req = null;
    #res = null;
    constructor(req, res) {
        this.#req = req;
        this.#res = res;
    }
    pathname() {
        return this.#req.originalUrl;
    }
    resource() {
        return this.pathname().split('/').filter(part => part.length > 0)[0];
    }
    id() {
        return this.pathname().split('/').filter(part => part.length > 0)[1];
    }
    method() {
        return this.#req.method;
    }
    payload(name) {
        return this.#req.body[name];
    }
    header(name) {
        return this.#req.get(name);
    }
    response() {
        return this.#res.response;
    }
}

class Rule {
    #current    = null;
    #rulesPath  = null;
    #script     = null;
    #luaScript  = null;
    #luaEnv     = null;
    #invalid = false;
    static createFromFile(rulesPath) {
        let rule = new Rule();
        try {
            rule.#rulesPath = rulesPath;
            rule.#script = fs.readFileSync(rulesPath, 'utf8');
            rule.#luaScript = rule.#luaEnv.parse(rule.#script);    
        } catch (error) {
            rule.#invalid = true;
        }
        return rule;
    }
    static createFromScript(script) {
        let rule = new Rule();
        try {
            rule.#script = script;
            rule.#luaScript = rule.#luaEnv.parse(rule.#script);
        } catch (error) {
            rule.#invalid = true;
        }
        return rule;
    }
    constructor() {
        const self = this;
        this.#invalid = false;
        this.#luaEnv = luainjs.createEnv();
        this.#current = null;
        {
            function id() {
                return self.#current.id();
            }
            function resource() {
                return self.#current.resource();
            }
            function pathname() {
                return self.#current.pathname();
            }
            function method() {
                return self.#current.method();
            }
            function header(name) {
                return self.#current.header(name);
            }
            function payload(name) {
                return self.#current.payload(name);
            }
            const request = new luainjs.Table({ header, method, pathname, id, resource, payload })
            this.#luaEnv.loadLib('request', request);
        }
        {
            function status(status) {
                const statusCode = parseInt(status, 10);
                if (Number.isInteger(statusCode)) {
                    self.#current.response().status(statusCode);
                    self.#current.response().lockStatus();
                }
            }
            function send(payload) {
                try {
                    self.#current.response().send(luainjs.utils.coerceArgToString(payload));
                    self.#current.response().lockResponse();
                } catch (error) {
                }
            }
            function exit() {
                return self.#current.response().exit();
            }
            function header(name, value) {
                return self.#current.response().addHeader(name, value);
            }
            const response = new luainjs.Table({ status, send, exit, header })
            this.#luaEnv.loadLib('response', response);    
        }
        this.#rulesPath = null;
        this.#script = null;
        this.#luaScript = null;
    }
    isInvalid() {
        return this.#invalid; 
    }
    apply(ruleOption) {
        try {
            this.#current = ruleOption;
            this.#luaScript.exec();
        } catch (error) {
            this.#current.response().status(500);
            this.#current.response().send(error.message);
            this.#current.response().exit();
        }
        return this.#current.response();
    }
};

module.exports = { Rule, RuleOptions };