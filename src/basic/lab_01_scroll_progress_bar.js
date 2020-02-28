import { fromEvent } from "rxjs";
import { map, tap, throttleTime } from "rxjs/operators";
console.clear();

function calculateProgress(element) {
    const { clientHeight, scrollHeight } = element;
    const scrollTop = window.scrollY;
    console.log(`clientHeight=${clientHeight}, scrollHeight=${scrollHeight}, scrollTop=${scrollTop}`);
    return scrollTop/(scrollHeight - clientHeight) * 100;
}

const progressBar = document.querySelector('.progress-bar');

// create stream of scroll events
const scroll$ = fromEvent(document, 'scroll');

//Operators are applied in pipe methods. Some are static.
const progress = scroll$.pipe(
    // if user keep scrolling we will update progress bar every 30ms of scrolling
    // we are limiting number of events produced
    // it emits value and then ignore next values for time window specified
    throttleTime(50),
    tap(e => console.dir(e)),
    map(({ target }) => calculateProgress(target.documentElement)),
    map((scrollProgressPercent) => progressBar.style.width = `${scrollProgressPercent}%`)
);

progress.subscribe();