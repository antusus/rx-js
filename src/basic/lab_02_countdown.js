import { interval } from 'rxjs';
import { scan, filter, mapTo, takeWhile, tap } from 'rxjs/operators';

console.clear();

const countdownElement = document.getElementById('countdown');
const messageElement = document.getElementById('message');
const countdownFrom = 10;

console.log(countdownElement.innerHTML);
countdownElement.innerHTML = countdownFrom;

const counter$ = interval(300);
counter$.pipe(
    // each value will be changed to -1
    mapTo(-1),
    // scan is used to accumulate values over time
    scan((accumulator, current) => accumulator + current, countdownFrom),
    //filter will not stop subscription, take while will
    // filter(v => v >= 0)
    // tap allows us to see next value, it should not have side effects
    tap(v => console.log(`Next value ${v}`)),
    takeWhile(v => v >= 0)
).subscribe((value) => {
    countdownElement.innerHTML = value;
    if (value == 0) {
        messageElement.innerHTML = 'Liftoff!';
    }
});