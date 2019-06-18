import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private messageSource = new BehaviorSubject(0);
    private speedSource = new BehaviorSubject(false);
    speedSettings = this.speedSource.asObservable();
    currentMessage = this.messageSource.asObservable();

    constructor() {
    }

    changeGeneration(msg: number) {
        this.messageSource.next(msg);
    }

    changeSpeed(setting: boolean) {
        this.speedSource.next(setting);
    }
}
