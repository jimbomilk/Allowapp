import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import * as Constants from '../../models/constants';
import {FormControl} from "@angular/forms";
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-published',
  templateUrl: 'published.html',

})
export class PublishedPage {
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  filterItem : any;

  published : any[];
  shown : any[];
  source: any;
  bySource: boolean;
  constructor(public navCtrl: NavController,private data: DataProvider) {
    this.source = "0";
    this.published = new Array;
    this.shown = new Array;
    this.bySource = false;
  }

  ionViewDidLoad()
  {
    this.data.getPublished().then( (res) =>{
      this.published = res;
      this.shown = this.published;
    })

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
        return item.extra.people.filter((person) => {
          person.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        })
      }
      return item.owner.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  sourceChanged(value){
    if (value._value == Constants.STATUS_ENVIADA) {
      this.bySource = true;
      this.filterItem = 'byPeople';
    }
    else {
      this.bySource = false;
      this.filterItem = 'byOwner'
    }
    this.shown =  this.data.filterBySource(this.published,value._value);
  }


}
