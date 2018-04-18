import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {
  capturas:any[];
  constructor(public navCtrl: NavController,private data: DataProvider) {

  }

  ionViewDidLoad()
  {
    this.capturas = this.data.getCapturadas();

  }

}
