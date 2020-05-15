export default class Thread {
    #threadId = null;
    #task = null;
    #name = null;
    #pool = null;
    constructor(name, task, pool) {
        this.#name = name;
        this.#task = task;
        this.#pool = pool;
    }

    async run(...params) {
        let result = await this.#pool.exec(this.#task, params);
        this.#pool.terminate();
        return result;
    }
}
