import { range, fromEvent, interval, from, empty } from "rxjs";
import { tap, take, map, filter, first, takeWhile, takeUntil, mapTo, scan, distinctUntilChanged, distinctUntilKeyChanged, debounce, debounceTime, pluck, throttleTime, sampleTime, auditTime, delay, mergeMap, switchMap, concatMap, catchError } from "rxjs/operators";
import { MyObserver, save, saveWithError, clickToPosition } from '../common'

console.clear();

// ------------------------------------------------
// Filtering operators
// ------------------------------------------------

// take - takes specified number of elements and completes
range(1, 5).pipe(take(3)).subscribe(new MyObserver('Take'));

//Like using filter and take(1)
const clicks$ = fromEvent(document.getElementById('generator'), 'click');

clicks$.pipe(
    map(e => ({ x: event.clientX, y: event.clientY })),
    first(({ y }) => y > 260)
)
    .subscribe(new MyObserver('first'));

// ------------------------------------------------
// Complete a stream when condition is met
// ------------------------------------------------

// takeWhile emits values as long as they pass condition
// second parameter makes takeWhile to emit value that stopped stream (true) or not (false)
clicks$.pipe(
    map(e => ({ x: event.clientX, y: event.clientY })),
    takeWhile(({ y }) => y <= 260, true)
)
    .subscribe(new MyObserver('takeWhile'));

// ------------------------------------------------
// Complete a stream based on other stream
// ------------------------------------------------

const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const abortButtonElement = document.getElementById('abortButton');
const countdownFrom = 10;

countdownElement.innerHTML = countdownFrom;

const abortClicked$ = fromEvent(abortButtonElement, 'click');

const counter$ = interval(1000);
counter$.pipe(
    mapTo(-1),
    scan((accumulator, current) => accumulator + current, countdownFrom),
    takeWhile(v => v >= 0),
    // takeUntill will emit complete when stream provided emits a value
    takeUntil(abortClicked$)
).subscribe((value) => {
    countdownElement.innerHTML = value;
    if (value == 0) {
        messageElement.innerHTML = 'Liftoff!';
    }
});

// ------------------------------------------------
// Ignore non unique values
// ------------------------------------------------

const numbers = [1, '1', 2, 3, 4, 5, 5, 6, 6, 7, 8, 9, 9, 9, 10];

from(numbers).pipe(
    // distinctUntilChanged uses === comparison by default, object references must match!
    distinctUntilChanged()
).subscribe(new MyObserver('distinctUntilChanged'));

from(numbers).pipe(
    // you can provide custom comparator
    distinctUntilChanged((prev, curr) => prev == curr)
).subscribe(new MyObserver('distinctUntilChanged+custom'));

from([
    { name: 'Brian' },
    { name: 'Joe' },
    { name: 'Joe' },
    { name: 'Sue' }
]).pipe(
    // usefull when comparing key from object
    distinctUntilKeyChanged('name')
).subscribe(new MyObserver('distinctUntilKeyChanged'));

// ------------------------------------------------
// Rate limiting operators
// ------------------------------------------------

// ------------- debounceTime ---------------------
const input = document.getElementById('text-input');
const keys$ = fromEvent(input, 'keyup');
keys$.pipe(
    // debounceTime emits last emitted value after pause specified in milliseconds
    debounceTime(300),
    // simmilar to map - alows for easier extraction of properties from objects
    pluck('target', 'value'),
    // if user removes letter and types same again we will not emit update
    distinctUntilChanged()
).subscribe(new MyObserver('Debounce'));

// ------------- throttleTime - check lab01 --------
interval(500).pipe(
    tap(v => console.log(`Value emitted ${v} [every 500ms]`)),
    // we should skip 2,3,4 because after value emission throttleTime is ignoring values for specified time
    throttleTime(2000),
    takeWhile(v => v <= 10)
).subscribe(new MyObserver('throttleTime[2s]'));

// ------------- sampleTime ------------------------
interval(500).pipe(
    // periodically checks what value was emmited and emits is 
    // here we are checking every 2s
    // 0,5s - 0; 1s - 1; 1,5s - 2 at 2s observable is proped and value 2 is emited
    sampleTime(2000),
    takeWhile(v => v <= 10)
).subscribe(new MyObserver('sampleTime[2s]'));

// ------------- auditTime -------------------------
interval(500).pipe(
    // periodically checks what value was emmited and emits first value observed
    // simmilar to throttleTime but is 
    // here we are checking every 2s
    // 0,5s - 0; 1s - 1; 1,5s - 2 at 2s observable is proped and value 2 is emited
    auditTime(2000),
    takeWhile(v => v <= 10)
).subscribe(new MyObserver('auditTime[2s]'));

// ------------------------------------------------
// Flatening/Transformation operators
// ------------------------------------------------

const flattenClicks$ = fromEvent(document.getElementById('flatten'), 'click');

// mergeMap - subscribes to all inner observables and emits values - does not care about order
flattenClicks$.pipe(
    clickToPosition(),
    tap(pos => console.log('mergeMap Position', pos)),
    // every click will create new observable
    // mergeMap will subscribe to each one of them and emit values from them
    mergeMap(save)
).subscribe(new MyObserver('mergeMap'))

// switchMap - subscribes to last inner observable and emits values, other is canceled
// here each click restarts counter
flattenClicks$.pipe(
    // every click will create new observable
    // switchMap will subscribe to last one canceling previous
    switchMap(() => interval(1000)),
    takeWhile(v => v < 15)
).subscribe(new MyObserver('switchMap'))

// concatMap - subscribe to observables in orde of apperance

// each click on radioOption will trigger save function to be called
// concatMap keeps only one Observale active, others are stored in order of apperance
// if one finishes then next is subscribed to
const radios = document.querySelectorAll('.radioOption');
fromEvent(radios, 'click').pipe(
    pluck('target', 'value'),
    concatMap(v => saveWithError(v).pipe(
        // if save throws an error we would stop listening on input clicks
        // catch error allows us to respond to an error, here we return empty and hope that next 
        // call will succeed
        catchError((error, caught) => {
            console.error(`error: ${error}`, caught);
            return empty();
        })
    ))
)
    .subscribe(new MyObserver('concatMap'));