import {Component, Input, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {Generation} from '../../model/generation';

@Component({
    selector: 'app-generation',
    templateUrl: './generation.component.html',
    styleUrls: ['./generation.component.css']
})
export class GenerationComponent implements OnInit {

    @Input('genNo') genNo: number;
    public generation: Generation;

    constructor(private rest: RestService) {
    }

    ngOnInit() {
        this.rest.getGeneration(this.genNo).subscribe(gen => {
            this.generation = gen;
        });
    }

    setNewGen(genNo: number) {
        this.genNo = genNo;
        this.rest.getGeneration(this.genNo).subscribe(gen => {
            this.generation = gen;
        });
    }

}
