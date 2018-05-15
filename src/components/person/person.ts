import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavController} from "ionic-angular";


/**
 * Generated class for the PersonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'person',
  templateUrl: 'person.html'
})
export class PersonComponent {
  @Input() person: any;
  @Input() photo: any;
  @Input() rightholder: boolean = false;
  @Output('remove') remove: EventEmitter<any> = new EventEmitter();

  constructor(public navCtrl: NavController) {

  }

  details(){
    this.navCtrl.push('PersonDetailsPage',{person:this.person,photo:this.photo});
  }

  removePerson(){
    this.remove.emit(this.person);

  }

  search(){
    this.navCtrl.push('ContactosPage',{minors:!this.rightholder});
  }

}
