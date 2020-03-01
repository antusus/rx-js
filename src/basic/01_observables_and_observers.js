import { Observable, fromEvent, of, range, from, interval, timer } from 'rxjs'
import { MyObserver, fromClickById } from '../common'
import { switchMapTo } from 'rxjs/operators';

console.clear();
// ------------------------------------------------
// Manualy create Observable
// ------------------------------------------------

// Observer needs next, error and complete methods
const observer = {
    next: value => console.log(`Next value ${value}`),
    error: error => console.error('Error', error),
    complete: () => console.log('Complete!')
};

// Observable
const observable = fromClickById('startManualCreation').pipe(
    switchMapTo(new Observable(subscriber => {
        subscriber.next('Hello');
        subscriber.next('from');
        subscriber.next('RxJS');
        subscriber.complete();
        subscriber.next('This will be ignored');
    }))
);

//Nothing will be produced by Observable unless someone subscribes
observable.subscribe(observer);

//You can also create observable on the fly (partial observable)
observable.subscribe(value => console.log('Partial observable next', value));

// ------------------------------------------------
// Delivering values asynchronously with Observable
// ------------------------------------------------

const asyncObservable = fromClickById('startAsync').pipe(
    switchMapTo(new Observable(subscriber => {
        let count = 0;
        const id = setInterval(() => {
            subscriber.next(count);
            count += 1;
            if (count >= 10) {
                subscriber.complete();
            }
        }, 500);

        //You can return function that will clean any resources you are managing in observable
        return () => {
            console.log('Clean function called');
            clearInterval(id);
        };
    }))
);

console.log('Before running async observable');
asyncObservable.subscribe(observer);
console.log('After running async observable');
//We expect all logs from async observable to appear after this last log

// ------------------------------------------------
// Manage subscriptions
// ------------------------------------------------

//You can add two sunscriptions together

const subscriptionOne = asyncObservable.subscribe(new MyObserver('One'));
const subscriptionTwo = asyncObservable.subscribe(new MyObserver('Two'));
//You can add subscriptions togheter - added subscriptions can be canceled together
subscriptionOne.add(subscriptionTwo);
setTimeout(() => {
    // Calling unsubscribe will not fire complete callback.
    // However the returned function will be invoked cleaning up any resources that were created by the subscription.
    subscriptionOne.unsubscribe();
}, 3500);
// We should see after 3,5s that cleanup log will be presented.

// ------------------------------------------------
// Create observables from DOM events
// ------------------------------------------------

//this observable will generate events for infinity
const keyup$ = fromEvent(document, 'keyup');

const keyupSubscription = keyup$.subscribe(new MyObserver('KeyUp observer'));

// We have to remember with unfinite observables to unsubscribe and cleanup reources
const timeout = 30000;
setTimeout(() => {
    keyupSubscription.unsubscribe();
    console.log(`Stopping the keyup subscription after ${timeout}s`);
}, timeout);

// ------------------------------------------------
// Create static observable
// ------------------------------------------------

of(1, 2, 3, 4, 5).subscribe(new MyObserver('Static with of'));
range(1, 5).subscribe(new MyObserver('Static with range'));
from([1, 2, 3, 4, 5]).subscribe(new MyObserver('Static from array'));
from('Hello!').subscribe(new MyObserver('Static from string'));

// ------------------------------------------------
// Observable from promise
// ------------------------------------------------
from(fetch('https://api.github.com/users/antusus')).subscribe(new MyObserver('From promise'));

// ------------------------------------------------
// Observable from iterator
// ------------------------------------------------

function* hello() {
    yield 'Hello';
    yield 'World';
    yield '!';
};
const iterator = hello();
from(iterator).subscribe(new MyObserver('From iterator'));

// ------------------------------------------------
// Emit values based on time interval
// ------------------------------------------------

// Interval generates next value after specified time defined in ms
// interval(1000).subscribe(new MyObserver('From interval'));
// If you need to send firs value after different time you can use timer
// here first value will generated after 100ms and all others after 1000ms
//timer(100, 1000).subscribe(new MyObserver('Timer 100/1000'))
// If you only want to generate one value after some time you can use timer withonly first argument passed
timer(100).subscribe(new MyObserver('Timer once after 100'))