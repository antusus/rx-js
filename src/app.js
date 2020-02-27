import css from './stylesheet.css'
import {Observable} from 'rxjs'

const observer = {
    next: value => console.log(`Next value ${value}`),
    error: error => console.errorlog('Error', error),
    complete: () => console.log('Complete!')
}

const observable = new Observable(subscriber => {
    subscriber.next('Hello');
    subscriber.next('from');
    subscriber.next('RxJS');
    subscriber.complete();
    subscriber.next('This will be ignored');
})

observable.subscribe(observer);