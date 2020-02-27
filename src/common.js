export class MyObserver {
    constructor(name) {
        this.name = name;
    }

    next(value) { console.log(`${this.name}: Next value`, value) }
    erro(error) { console.errorlog(`${this.name}: Error`, error) }
    complete() { console.log(`${this.name}: Complete!`) }
};