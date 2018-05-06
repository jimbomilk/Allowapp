import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import * as Constants from '../../models/constants';
import {FormControl} from "@angular/forms";
import 'rxjs/add/operator/debounceTime';
@IonicPage()
@Component({
  selector: 'page-published',
  templateUrl: 'published.html',

})
export class PublishedPage {
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  filterItem : any;
  showPeople:any;

  published : any[];
  shown : any[];
  source: any;
  bySource: boolean;
  constructor(public navCtrl: NavController,private data: DataProvider) {
    this.source = "0";
    this.published = new Array;
    this.shown = new Array;
    this.bySource = false;
    this.showPeople = false;
    this.searchControl = new FormControl();

  }

  ionViewDidLoad()
  {
    this.shown = this.data.photos;

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  setFilteredItems() {

    this.shown = this.filterItems(this.searchTerm);

  }

  filterItems(searchTerm){

    return this.shown.filter((item) => {
      if (this.filterItem == 'byPeople') {
        return item.people.filter((person) => {
          person.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        })
      }
      return item.owner.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  onSearchInput(){
    this.searching = true;
  }

  sourceChanged(value){
    if (value._value == Constants.STATUS_ENVIADA) {
      this.bySource = true;
      this.filterItem = 'byPeople';
      this.showPeople = true;
      this.shown = this.data.getEnviadas();
    }else if (value._value == Constants.STATUS_RECIBIDA) {
      this.shown = this.data.getRecibidas();
    }
    else {
      this.bySource = false;
      this.filterItem = 'byOwner'
      this.shown = this.data.photos;
    }

  }


}
