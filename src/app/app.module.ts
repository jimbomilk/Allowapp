import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PhotoPage } from '../pages/photo/photo';
import { ProfilePage } from '../pages/profile/profile';
import { PendingPage } from '../pages/pending/pending';
import { PublishedPage } from '../pages/published/published';
import { TabsPage } from '../pages/tabs/tabs';
import { PersonDetailsPage } from "../pages/person-details/person-details";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {PhotoInfoComponent} from "../components/blocks/photo-info/photo-info"
import {PhotoWhoComponent} from "../components/blocks/photo-who/photo-who";
import {PhotoShareComponent} from "../components/blocks/photo-share/photo-share";
import {PhotoRequestComponent} from "../components/photo-request/photo-request";

import {PhotoApproveComponent} from "../components/photo-approve/photo-approve";
import {PhotoInfoApprovalComponent} from "../components/blocks/photo-info-approval/photo-info-approval";
import {HeaderLogoComponent} from "../components/blocks/header-logo/header-logo";
import {PhotoApprovalComponent} from "../components/blocks/photo-approval/photo-approval";
import {PhotoSocialComponent} from "../components/blocks/photo-social/photo-social";
import {PhotoSendPage} from "../pages/photo-send/photo-send";
import {PhotoItemComponent} from "../components/blocks/photo-item/photo-item";
import {PersonComponent} from "../components/blocks/person/person";
import {TutorDetailsComponent} from "../components/blocks/tutor-details/tutor-details";
import {DataProvider } from '../providers/data/data';
import {HttpModule} from "@angular/http";
import {PhotoDetailsPage} from "../pages/photo-details/photo-details";
import {AbsoluteDragDirective} from "../directives/absolute-drag/absolute-drag";
import {SignaturePadModule} from "angular2-signaturepad";
import {SignatureComponent} from "../components/blocks/signature/signature";
import {PhotoPublishedComponent} from "../components/photo-published/photo-published";
import {PipesModule} from "../pipes/pipes.module";
import {FlashCardComponent} from "../components/flash-card/flash-card";
import { AlertProvider } from '../providers/alert/alert';
import { ToastProvider } from '../providers/toast/toast';
import {Camera} from "@ionic-native/camera";
import { CameraProvider } from '../providers/camera/camera';
import { DbProvider } from '../providers/db/db';
import {SQLite} from "@ionic-native/sqlite";


@NgModule({
  declarations: [
    MyApp,
    PhotoPage,
    ProfilePage,
    PendingPage,
    PublishedPage,
    TabsPage,
    PhotoSendPage,
    PersonDetailsPage,
    PhotoDetailsPage,
    PhotoRequestComponent,
    PhotoApproveComponent,
    PhotoPublishedComponent,
    PhotoInfoComponent,
    PhotoWhoComponent,
    PhotoShareComponent,
    PhotoInfoApprovalComponent,
    HeaderLogoComponent,
    PhotoApprovalComponent,
    PhotoSocialComponent,
    PhotoItemComponent,
    PersonComponent,
    TutorDetailsComponent,
    SignatureComponent,
    FlashCardComponent,
    AbsoluteDragDirective,
  ],
  imports: [
    BrowserModule,HttpModule,SignaturePadModule,
    IonicModule.forRoot(MyApp),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PhotoPage,
    ProfilePage,
    PendingPage,
    PublishedPage,
    TabsPage,
    PhotoSendPage,
    PersonDetailsPage,
    PhotoDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    AlertProvider,
    ToastProvider,
    Camera,
    CameraProvider,
    SQLite,
    DbProvider
  ]
})
export class AppModule {}
