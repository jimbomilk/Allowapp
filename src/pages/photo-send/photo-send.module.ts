import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoSendPage } from './photo-send';

@NgModule({
  declarations: [
    PhotoSendPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotoSendPage),
  ],
})
export class PhotoSendPageModule {}
