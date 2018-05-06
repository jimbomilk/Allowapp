import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PhotoPage} from "../photo/photo";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    PhotoPage
  ],
  imports: [
    IonicPageModule.forChild(PhotoPage),
    ComponentsModule
  ],
})
export class PhotoPageModule {}
