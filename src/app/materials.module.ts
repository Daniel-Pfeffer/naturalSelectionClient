import {NgModule} from '@angular/core';
import {
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule, MatRadioModule,
    MatSidenavModule,
    MatSnackBarModule, MatStepperModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [],
    imports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatStepperModule,
        ReactiveFormsModule,
        MatRadioModule
    ],
    exports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatCardModule,
        MatSnackBarModule,
        MatDialogModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatStepperModule,
        ReactiveFormsModule,
        MatRadioModule
    ]
})
export class MaterialsModule {
}
