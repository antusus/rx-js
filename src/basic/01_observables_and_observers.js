import { Observable } from 'rxjs'

console.clear();
// ------------------------------------------------
// Manualy create Observable
// ------------------------------------------------

// Observer needs next, error and complete methods
const observer = {
    next: value => console.log(`Next value ${value}`),
    error: error => console.errorlog('Error', error),
    complete: () => console.log('Complete!')
};

// Observable
const observable = new Observable(subscriber => {
    subscriber.next('Hello');
    subscriber.next('from');
    subscriber.next('RxJS');
    subscriber.complete();
    subscriber.next('This will be ignored');
});

//Nothing will be produced by Observable unless someone subscribes
observable.subscribe(observer);

//You can also create observable on the fly (partial observable)
observable.subscribe(value => console.log('Partial observable next', value));

// ------------------------------------------------
// Delivering values asynchronously with Observable
// ------------------------------------------------

const asyncObservable = new Observable(subscriber => {
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
});

// console.log('Before running async observable');
// asyncObservable.subscribe(observer);
// console.log('After running async observable');
//We expect all logs from async observable to appear after this last log

// ------------------------------------------------
// Manage subscriptions
// ------------------------------------------------

//You can add two sunscriptions together

class MyObserver {
    constructor(name){
        this.name = name;
    }

    next(value) { console.log(`${this.name}: Next value ${value}`) }
    erro(error) { console.errorlog(`${this.name}: Error`, error) }
    complete() { console.log(`${this.name}: Complete!`) }
};

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