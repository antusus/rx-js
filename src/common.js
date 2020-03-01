import { of, throwError, fromEvent } from 'rxjs'
import { delay, map } from 'rxjs/operators'

export class MyObserver {
    constructor(name) {
        this.name = name;
    }

    next(value) { console.log(`${this.name}: Next value`, value) }
    erro(error) { console.errorlog(`${this.name}: Error`, error) }
    complete() { console.log(`${this.name}: Complete!`) }
};

export function clickToPosition() {
    return map(e => ({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
    }));
};

// simulates network traffic
export function save(any) {
    return of(any).pipe(delay(1000));
};

var saveCount = 1;
export function saveWithError(any) {
    saveCount += 1;
    if (saveCount % 5 === 0) {
        return throwError('Save failed');
    } else {
        return save(any);
    }
};

export function fromClickById(elementId) {
    return fromEvent(document.getElementById(elementId), 'click');
};