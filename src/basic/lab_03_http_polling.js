import { fromEvent, timer } from "rxjs";
import { switchMap, switchMapTo, takeUntil, tap, pluck, finalize } from "rxjs/operators";
import { ajax } from 'rxjs/ajax';

console.clear();

const interval = 5000;

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const pollingLabel = document.getElementById('polling-status');
const dogImage = document.getElementById('dog');
const intervalText = document.getElementById('interval');
intervalText.innerHTML = interval;

const stopClicks$ = fromEvent(stopButton, 'click');

const dogImages$ = ajax.getJSON('https://random.dog/woof.json').pipe(pluck('url'));

fromEvent(startButton, 'click').pipe(
    tap(() => pollingLabel.innerHTML = 'Running'),
    switchMap(() => timer(0, interval).pipe(
        switchMapTo(dogImages$),
        takeUntil(stopClicks$),
        // executes when observable completes
        finalize(() => (pollingLabel.innerHTML = 'Stopped'))
    ))
)
    .subscribe(url => dogImage.src = url);