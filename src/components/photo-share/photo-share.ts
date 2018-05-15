import {Component, Input, OnInit} from '@angular/core';
import {Sharing} from "../../models/model";

/**
 * Generated class for the PhotoShareComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-share',
  templateUrl: 'photo-share.html'
})
export class PhotoShareComponent implements  OnInit {

  @Input() sharing:Sharing;
  @Input() title:string;

  facebook:any;
  twitter:any;
  instagram:any;
  web:any;
  initial:Sharing;
  constructor() {

    this.web='disabled';
    this.instagram='disabled';
    this.twitter='disabled';
    this.facebook='disabled';
  }

  ngOnInit(){
    this.updateInterface();
    if(this.sharing)
      this.initial = new Sharing(this.sharing.facebook, this.sharing.instagram, this.sharing.twitter, this.sharing.web);
    else
      this.initial = new Sharing();
  }

  updateInterface(){
    if (this.sharing) {
      this.web = this.sharing.web =="" ? 'disabled' : 'primary';
      this.facebook = this.sharing.facebook ==""? 'disabled' : 'primary';
      this.instagram = this.sharing.instagram ==""? 'disabled' : 'primary';
      this.twitter = this.sharing.twitter ==""? 'disabled' : 'primary';
    }
  }

  change(el){
    if (!this.sharing)
      return;

    if (el == 'web')
      this.sharing.web  = (this.sharing.web==this.initial.web)?"":this.initial.web;
    if (el == 'facebook')
      this.sharing.facebook  = (this.sharing.facebook==this.initial.facebook)?"":this.initial.facebook;
    if (el == 'instagram')
      this.sharing.instagram  = (this.sharing.instagram==this.initial.instagram)?"":this.initial.instagram;
    if (el == 'twitter')
      this.sharing.twitter  = (this.sharing.twitter==this.initial.twitter)?"":this.initial.twitter;

    this.updateInterface();

  }
}
