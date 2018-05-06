import { Component } from '@angular/core';
import {Events} from "ionic-angular";
import {AlertProvider} from "../../providers/alert/alert";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'PhotoPage';
  tab2Root = 'PendingPage';
  tab3Root = 'PublishedPage';
  tab4Root = 'ProfilePage';

  public tabBadge1: string = "";
  public tabBadge2: string = "";
  public tabBadge3: string = "";
  public tabBadge4: string = "";

  constructor(public events: Events, public alert:AlertProvider) {
    this.events.subscribe('badge1:updated', (value) => {
      this.tabBadge1 = value;
    });
    this.events.subscribe('badge2:updated', (value) => {
      this.tabBadge2 = value;
    });
    this.events.subscribe('badge3:updated', (value) => {
      this.tabBadge3 = value;
    });
    this.events.subscribe('badge4:updated', (value) => {
      this.tabBadge4 = value;
    });
  }


}
