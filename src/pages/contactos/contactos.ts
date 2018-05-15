import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import { Contacts} from "@ionic-native/contacts";
import {FormControl} from "@angular/forms";
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the CrearContactoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactos',
  templateUrl: 'contactos.html',
})
export class ContactosPage {
  minors : boolean = true;
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  listaContactos:any[]=[];
  avatar:string="./assets/icon/avatar.png";
  constructor(public navCtrl: NavController, public navParams: NavParams, private contacts:Contacts, private modalCtrl:ModalController,public viewCtrl: ViewController) {
    this.searchControl = new FormControl();
    this.minors = this.navParams.get("minors");
  }

  ionViewDidLoad() {
    this.cargarListaContactos();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

      this.searching = false;
      this.setFilteredItems();

    });

  }

  onSearchInput(){
    this.searching = true;
  }

  setFilteredItems() {

    this.listaContactos = this.filterItems(this.searchTerm);

  }

  cargarListaContactos(){
    this.contacts.find(
      ["id","displayName", "phoneNumbers"],
      {multiple: true, hasPhoneNumber: true}
    )
      .then(res => {
        console.log({funcion:'CargarListaContactos',res:res})
        let datosMostar:any[]=[];
        res.map((item) =>{
          if(item.displayName != null && item.phoneNumbers != null){
            datosMostar.push({displayName:item.displayName,id:item.id,phoneNumbers:item.phoneNumbers})
          }
        })
        console.log({funcion:'CargarListaContactos',datosMostar:datosMostar})
        this.listaContactos = datosMostar.sort(function(a, b){
          if(a.displayName < b.displayName) return -1;
          if(a.displayName > b.displayName) return 1;
          return 0;
        });
      },error => {
        console.log({error:error})
      })
  }
  /**
   * Abre una ventana modal para ingresar la informacion del contacto a crear
   */
  modalNuevoContacto(){
    let modal = this.modalCtrl.create('CrearContactoPage');
    modal.onDidDismiss(data => {
      console.log({dataOnDidDismiss:data});
      if(data.estado){
        console.log(data)
        this.listaContactos.push({displayName:data.contacto.displayName,photos:[{value:this.avatar}],phoneNumbers:data.contacto.phoneNumbers});
      }
    });
    modal.present();
  }

  filterItems(searchTerm){

    return this.listaContactos.filter((item) => {
      return item.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  selectContacto(contacto){
    this.dismiss({estado:true,contacto:contacto});
  }

  selectMenor(){
    this.dismiss({estado:true,minor:true});
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

}
