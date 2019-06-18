import {Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {SocketService} from '../../services/socket.service';
import {MatDialog} from '@angular/material';
import {StartDialogComponent} from '../start-dialog/start-dialog.component';
import {GenerationComponent} from '../generation/generation.component';
import {DataService} from '../../services/data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
    public simRan: boolean;
    public generationTicker: number;
    private maxGen: number;
    private formGroup: FormGroup;
    private speedSettings = false;
    @ViewChild('generationComponent', {static: false}) genComp: GenerationComponent;

    constructor(private rest: RestService, private data: DataService, private dialog: MatDialog, private builder: FormBuilder) {
        this.simRan = false;
        this.generationTicker = 0;
    }

    ngOnInit() {
        this.formGroup = this.builder.group({
            genToRun: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
    }

    startSimulation() {
        const dialog = this.dialog.open(StartDialogComponent);
        dialog.afterClosed().subscribe(config => {
            console.log(config);
            if (config) {
                this.maxGen = config.genToRun as number;
                this.rest.start(config.startConfigs).subscribe(res => {
                    console.log(res);
                    this.rest.run(config.genToRun).subscribe(() => {
                        this.simRan = true;
                    });
                });
            }

        });
    }

    prev() {
        this.generationTicker === 0 ? this.generationTicker = this.maxGen : this.generationTicker--;
        this.genComp.setNewGen(this.generationTicker);
        this.data.changeGeneration(this.generationTicker);
    }

    next() {
        // tslint:disable-next-line:triple-equals
        this.generationTicker == this.maxGen ? this.generationTicker = 0 : this.generationTicker++;
        this.genComp.setNewGen(this.generationTicker);
        this.data.changeGeneration(this.generationTicker);
    }

    runGenerations() {
        this.rest.run(this.formGroup.controls.genToRun.value as number).subscribe(() => {
            this.maxGen += this.formGroup.controls.genToRun.value as number;
            this.simRan = true;
            this.formGroup.controls.genToRun.setValue('');
        });
    }

    /*
     * TODO fix bug with file download
     */
    saveProgress() {
        this.rest.save().subscribe(() => {
            console.log(`Successfully saved`);
        });
    }

    speed() {
        this.speedSettings = !this.speedSettings;
        this.data.changeSpeed(this.speedSettings);
    }
}
