import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams } from 'ionic-angular';
import {Rightholder} from "../../models/model";
import {AuthProvider} from "../../providers/auth/auth";


/**
 * Generated class for the PersonDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-person-details',
  templateUrl: 'person-details.html',
})
export class PersonDetailsPage {

  person:any;
  photo:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth:AuthProvider) {
    this.person = this.navParams.get("person");
    this.photo = this.navParams.get("photo");
  }

  ionViewDidLoad() {

  }

  removeTutor(index){
    if (this.person.rightholders) {
      if (index > -1) {
        this.person.rightholders.splice(index, 1);
      }
    }
  }


  addTutor(){

    let rigthholder = new Rightholder('tutor','','','');
    if (!this.person.rightholders)
      this.person.rightholders = new Array();

    this.person.rightholders.push(rigthholder);
  }


  addSignature(event){
    // Salvamos y salimos
    this.auth.send(this.photo).subscribe();

  }

  save()
  {
    this.auth.send(this.photo).subscribe();
    this.navCtrl.pop();

  }
}
