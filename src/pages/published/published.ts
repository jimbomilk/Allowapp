import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";

@Component({
  selector: 'page-published',
  templateUrl: 'published.html',

})
export class PublishedPage {
  published : any[];
  shown : any[];
  source: string;
  constructor(public navCtrl: NavController,private data: DataProvider) {
    this.source = 'enviadas';
  }

  ionViewDidLoad()
  {
    this.published = this.data.getPublished();
    this.shown = this.data.getPublished();
  }

  sourceChanged(value){
    this.shown =  this.data.filterBySource(this.published,this.source);
  }


}
