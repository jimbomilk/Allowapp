import { Component } from '@angular/core';

import { PhotoPage } from '../photo/photo';
import { ProfilePage } from '../profile/profile';
import { PendingPage } from '../pending/pending';
import { PublishedPage } from '../published/published';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = PhotoPage;
  tab2Root = PendingPage;
  tab3Root = PublishedPage;
  tab4Root = ProfilePage;

  constructor() {

  }
}
