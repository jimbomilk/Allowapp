import { NgModule } from '@angular/core';
import { PhotoInfoComponent } from './photo-info/photo-info';
import { PhotoShareComponent } from './photo-share/photo-share';
import { PhotoInfoApprovalComponent } from './photo-info-approval/photo-info-approval';
import { HeaderLogoComponent } from './header-logo/header-logo';
import { PhotoApprovalComponent } from './photo-approval/photo-approval';
import { PhotoSocialComponent } from './photo-social/photo-social';
import { PhotoItemComponent } from './photo-item/photo-item';
import { PersonComponent } from './person/person';
import { TutorDetailsComponent } from './tutor-details/tutor-details';
import { FlashCardComponent } from './flash-card/flash-card';
import { SearchContactoComponent } from './search-contacto/search-contacto';
import {IonicModule} from "ionic-angular";
import {SignatureComponent} from "./signature/signature";
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import { StickerComponent } from './sticker/sticker';
import {AbsoluteDragDirective} from "../directives/absolute-drag/absolute-drag";
import { PhotoPublishedComponent } from './photo-published/photo-published';

@NgModule({
	declarations: [
    PhotoInfoComponent,
    PhotoShareComponent,
    PhotoInfoApprovalComponent,
    HeaderLogoComponent,
    PhotoApprovalComponent,
    PhotoSocialComponent,
    PhotoItemComponent,
    PersonComponent,
    TutorDetailsComponent,
    FlashCardComponent,
    SearchContactoComponent,
    SignatureComponent,
    SignaturePad,
    StickerComponent,
    AbsoluteDragDirective,
    PhotoPublishedComponent,
    ],
	imports: [
	  IonicModule
  ],
	exports: [
    PhotoInfoComponent,
    PhotoShareComponent,
    PhotoInfoApprovalComponent,
    HeaderLogoComponent,
    PhotoApprovalComponent,
    PhotoSocialComponent,
    PhotoItemComponent,
    PersonComponent,
    TutorDetailsComponent,
    FlashCardComponent,
    SearchContactoComponent,
    SignatureComponent,
    StickerComponent,
    PhotoPublishedComponent
    ]
})
export class ComponentsModule {}
