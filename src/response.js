module.exports = class Response {
    #status = null;        
    #response = null;
    #headers = [];        
    #exit = false;
    #statusIsLocked = false;
    #responseIsLocked = false;
    shouldExit() {
        return this.#exit;
    }
    exit() {
        this.#exit = true;
        return this;
    }
    getHeaders() {
        return this.#headers;
    }
    getHeader(name) {
        const header = this.#headers.find(header => header.name === name);
        return header ? header.value : null;
    }
    addHeader(name, value) {
        this.#headers.push({name: name, value: value});
    }
    lockStatus() {
        this.#statusIsLocked = true;
        return this;
    }
    getStatus() {
        return this.#status ?? 200;
    }
    status(status) {
        if (!this.#statusIsLocked) {
            this.#status = status;
        }
        return this;
    }
    lockResponse() {
        this.#responseIsLocked = true;
        return this;
    }
    getResponse() {
        return this.#response ?? "";
    }
    send(response) {
        if (!this.#responseIsLocked) {
            this.#response = response;
        }
        return this;
    }
};