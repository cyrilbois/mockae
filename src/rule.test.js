const { Rule, RuleOptions } = require('./rule');
const Response = require('./response.js');

describe('Rule', () => {
    let ruleOption;

    beforeEach(() => {
        ruleOption = new RuleOptions({ 
                originalUrl: '/resource/123', 
                method: 'GET', 
                get: function (name) { if (name == 'x-unit-test') return 'test'; return null; }, 
                body: {title: "test title"} 
            }, { 
                response: new Response(),
                set: function (name, value) { if (name == 'x-unit-test') return 'test'; return null; }
            }
        );
    });

    test('sets response status code', () => {
        const rule = Rule.createFromScript('response.status(402);');
        const response = rule.apply(ruleOption);
        expect(response.getStatus()).toBe(402);
    });

    test('sets response body with send', () => {
        const rule = Rule.createFromScript('response.send("ok");');
        const response = rule.apply(ruleOption);
        expect(response.getResponse()).toBe("ok");
    });

    test('sets response header', () => {
        const rule = Rule.createFromScript('response.header("x-unit-test-response", "ok");');
        const response = rule.apply(ruleOption);
        expect(response.getHeader("x-unit-test-response")).toBe("ok");
    });

    test('sets response to exit', () => {
        const rule = Rule.createFromScript('response.exit();');
        const response = rule.apply(ruleOption);
        expect(response.shouldExit()).toBe(true);
    });

    test('returns resource name from request', () => {
        const rule = Rule.createFromScript('response.send(request.resource());');
        const response = rule.apply(ruleOption);
        expect(response.getResponse()).toBe("resource");
    });

    test('returns request ID', () => {
        const rule = Rule.createFromScript('response.status(request.id());');
        const response = rule.apply(ruleOption);
        expect(response.getStatus()).toBe(123);
    });

    test('returns request URL', () => {
        const rule = Rule.createFromScript('response.send(request.pathname());');
        const response = rule.apply(ruleOption);
        expect(response.getResponse()).toBe('/resource/123');
    });

    test('returns request method', () => {
        const rule = Rule.createFromScript('response.send(request.method());');
        const response = rule.apply(ruleOption);
        expect(response.getResponse()).toBe('GET');
    });

    test('returns request header value', () => {
        const rule = Rule.createFromScript('response.send(request.header("x-unit-test"));');
        const response = rule.apply(ruleOption);
        expect(response.getResponse()).toBe('test');
    });

    test('returns request payload value', () => {
        const rule = Rule.createFromScript('response.send(request.payload("title"));');
        const response = rule.apply(ruleOption);
        expect(response.getResponse()).toBe('test title');
    });
});
