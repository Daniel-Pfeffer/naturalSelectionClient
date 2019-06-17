import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {DisplaySimulationComponent} from './components/display-simulation/display-simulation.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {StartDialogComponent} from './components/start-dialog/start-dialog.component';
import {MaterialsModule} from './materials.module';
import {RestService} from './services/rest.service';
import {HttpClientModule} from '@angular/common/http';
import { GenerationComponent } from './components/generation/generation.component';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
    declarations: [
        AppComponent,
        DisplaySimulationComponent,
        SideMenuComponent,
        StartDialogComponent,
        GenerationComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        MaterialsModule,
        HttpClientModule,
        ScrollingModule
    ],
    entryComponents: [StartDialogComponent],
    providers: [RestService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
