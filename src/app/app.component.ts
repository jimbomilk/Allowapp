import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {DbProvider} from "../providers/db/db";
import {DataProvider} from "../providers/data/data";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, db:DbProvider,data:DataProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      db.connect()
        /*
        .then(() => db.dropTables())
        .then(() => db.createTables())
        .then(() => data.loadDataTest())*/
        .catch( e=> {
          console.log("Error",e);
        })

    });
  }
}
