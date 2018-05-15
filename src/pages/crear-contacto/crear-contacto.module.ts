import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearContactoPage } from './crear-contacto';

@NgModule({
  declarations: [
    CrearContactoPage,
  ],
  imports: [
    IonicPageModule.forChild(CrearContactoPage),
  ],
})
export class CrearContactoPageModule {}
