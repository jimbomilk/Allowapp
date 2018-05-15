import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonDetailsPage } from './person-details';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    PersonDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonDetailsPage),
    ComponentsModule

  ],
})
export class PersonDetailsPageModule {}
