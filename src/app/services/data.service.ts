import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private messageSource = new BehaviorSubject(0);
    currentMessage = this.messageSource.asObservable();

    constructor() {
    }

    changeGeneration(msg: number) {
        this.messageSource.next(msg);
    }
}
