import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StartConfigs} from '../../model/startConfigs';
import {MatDialogRef} from '@angular/material';
import {FoodConfig} from '../../model/foodConfig';

@Component({
    selector: 'app-start-dialog',
    templateUrl: './start-dialog.component.html',
    styleUrls: ['./start-dialog.component.css']
})
export class StartDialogComponent implements OnInit {

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    constructor(private builder: FormBuilder, private dialog: MatDialogRef<StartDialogComponent>) {
    }

    ngOnInit() {
        this.firstFormGroup = this.builder.group({
            startingPop: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            mapSize: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
        this.secondFormGroup = this.builder.group({
            foodAmount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            amountChanges: [''],
            amountChanging: ['', Validators.pattern('^[0-9]*$')],
            minFood: ['', Validators.pattern('^[0-9]*$')],
            maxFood: ['', Validators.pattern('^[0-9]*$')]
        });
        this.thirdFormGroup = this.builder.group({
            genToRun: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
        });
    }

    close(b: boolean) {
        if (b) {
            const controls1 = this.firstFormGroup.controls;
            const control2 = this.secondFormGroup.controls;
            const foodConfigs: FoodConfig = new FoodConfig(control2.foodAmount.value as number, control2.amountChanges.value as number, control2.amountChanging.value as number, control2.minFood.value as number, control2.maxFood.value as number);
            const startConfigs: StartConfigs = new StartConfigs(controls1.startingPop.value as number, foodConfigs, controls1.mapSize.value as number);
            this.dialog.close({startConfigs: startConfigs, genToRun: this.thirdFormGroup.controls.genToRun.value as number});
        } else {
            this.dialog.close();
        }

    }
}
