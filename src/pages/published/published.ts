import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {Photo} from "../../models/model";
@IonicPage()
@Component({
  selector: 'page-published',
  templateUrl: 'published.html',

})
export class PublishedPage {
  showPeople:any;
  profile:any;
  source: any;
  recibidas : Array<Photo>;
  shown : Array<Photo>;

  constructor(public navCtrl: NavController,private data: DataProvider) {
    this.source = 'propias';
    this.recibidas = new Array();
    this.shown = new Array();
    this.showPeople = false;
    //this.searchControl = new FormControl();

  }

  ionViewWillEnter() {
    this.shown = this.data.photos;
    this.profile = this.data.user;

    this.data.getRecibidas().subscribe(data => {
      this.recibidas = data;
    });
      /*this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });*/
  }
/*
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
*/



}
