import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PendingPage} from "../pending/pending";
import {ComponentsModule} from "../../components/components.module";
import {SwingStackComponent} from "angular2-swing";


@NgModule({
  declarations: [
    PendingPage,
    SwingStackComponent
  ],
  imports: [
    IonicPageModule.forChild(PendingPage),
    ComponentsModule

  ],
})
export class PendingPageModule {}
