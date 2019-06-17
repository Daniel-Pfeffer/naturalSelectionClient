import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StartConfigs} from '../model/startConfigs';
import {Generation} from '../model/generation';

@Injectable({
    providedIn: 'root'
})
export class RestService {

    private ip = 'http://localhost:8888/';

    constructor(private http: HttpClient) {
    }

    public save() {
        return this.http.get(this.ip + 'save');
    }

    public run(cnt: number) {
        return this.http.get(this.ip + 'run/' + cnt);
    }

    public getGeneration(genNo: number) {
        return this.http.get<Generation>(this.ip + 'getGeneration/' + genNo);
    }

    public load(file) {
        throw new Error('Not supported yet');
        // return this.http.post(this.ip + 'load/', file);
    }

    public start(config: StartConfigs) {
        console.log(`send start`);
        return this.http.post(this.ip + 'start', config);
    }
}
