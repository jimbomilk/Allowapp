import {Component, Input} from '@angular/core';
import {ModalController} from "ionic-angular";

/**
 * Generated class for the SearchContactoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'search-contacto',
  templateUrl: 'search-contacto.html'
})
export class SearchContactoComponent {

  @Input() person:any;
  @Input() minors:boolean = true;

  constructor(private modalCtrl:ModalController) {
  }

  searchContacto(){
    let modal = this.modalCtrl.create('ContactosPage',{minors:this.minors});
    modal.onDidDismiss(data => {
      console.log({dataOnDidDismiss:data});
      if(data.estado){
        this.person.phoneid = data.contacto.id;
        this.person.name = data.contacto.displayName;
        this.person.phone = data.contacto.phoneNumbers[0].value;
      }
    });
    modal.present();
  }

}
