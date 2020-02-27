import { range, fromEvent, interval } from "rxjs";
import { take, map, filter, first, takeWhile, takeUntil, mapTo, scan } from "rxjs/operators";
import { MyObserver } from '../common'

console.clear();

// ------------------------------------------------
// Filtering operators
// ------------------------------------------------

// take - takes specified number of elements and completes
range(1,5).pipe(take(3)).subscribe(new MyObserver('Take'));

//Like using filter and take(1)
const clicks$ = fromEvent(document.getElementById('generator'), 'click');

clicks$.pipe(
    map(e => ({x: event.clientX, y: event.clientY})),
    first(({y}) => y > 260)
)
.subscribe(new MyObserver('first'));

// ------------------------------------------------
// Complete a stream when condition is met
// ------------------------------------------------

// takeWhile emits values as long as they pass condition
// second parameter makes takeWhile to emit value that stopped stream (true) or not (false)
clicks$.pipe(
    map(e => ({x: event.clientX, y: event.clientY})),
    takeWhile(({y}) => y <= 260, true)
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
