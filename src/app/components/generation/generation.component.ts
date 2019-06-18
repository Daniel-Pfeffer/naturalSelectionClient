import {Component, Input, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {Generation} from '../../model/generation';
import {CustomBlob} from '../../model/custom-blob';

@Component({
    selector: 'app-generation',
    templateUrl: './generation.component.html',
    styleUrls: ['./generation.component.css']
})
export class GenerationComponent implements OnInit {

    // tslint:disable-next-line:no-input-rename
    @Input('genNo') genNo: number;
    public generation: Generation;
    public bestBlob: CustomBlob;

    constructor(private rest: RestService) {
    }

    ngOnInit() {
        this.rest.getGeneration(this.genNo).subscribe(gen => {
            this.generation = gen;
            this.bestBlob = this.generation.blobs.sort(this.blobSort)[0];
        });
    }

    setNewGen(genNo: number) {
        this.genNo = genNo;
        this.rest.getGeneration(this.genNo).subscribe(gen => {
            this.generation = gen;
        });
    }

    private blobSort(a: CustomBlob, b: CustomBlob) {
        if (a.properties.int > b.properties.int) {
            return 1;
        } else if (a.properties.int < b.properties.int) {
            return -1;
        } else {
            return 0;
        }
    }
}
