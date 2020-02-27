import { range, fromEvent } from "rxjs";
import { take, map, filter, first, takeWhile } from "rxjs/operators";
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
