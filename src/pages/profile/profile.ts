import {Component} from '@angular/core';
import {AlertProvider} from "../../providers/alert/alert";
import {ToastProvider} from "../../providers/toast/toast";
import {User} from "../../models/model";
import {FormBuilder, Validators} from "@angular/forms";
import {Events, IonicPage, NavController, NavParams} from "ionic-angular";
import {DbProvider} from "../../providers/db/db";
import {DataProvider} from "../../providers/data/data";

@IonicPage()
@Component({
  selector: 'profile-contact',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profilePicture: string;
  placeholderPicture = 'https://api.adorable.io/avatars/50/abott@adorable.png';
  user : any;
  userForm:any;
  redirection :boolean = false;


  constructor(
    public navController:NavController,
    public navParameters:NavParams,
    public alertService: AlertProvider,
    public toastCtrl: ToastProvider,
    public db: DbProvider,
    public formBuilder: FormBuilder,
    public events:Events,
    private data:DataProvider,

  ) {

    let re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.userForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z]*'), Validators.required])],
      phone: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern(re), Validators.required])],
      password : ['',Validators.compose([Validators.required])],
      facebook: [false],
      instagram: [false],
      twitter: [false],
      web: [false]
    });



  }

  toggleSocial(network) {
    this.user.value[network] = !this.user.value[network]
    this.toastCtrl.create('Configuración de '+network+ ' modificada');
  }

  logOut() {
    this.alertService.presentAlertWithCallback('¿Estás seguro?',
      '¿Deseas salir de la aplicación?').then((yes) => {
      if (yes) {
        this.toastCtrl.create('Logged out of the application');
      }
    });
  }

  ionViewDidLoad(){
    this.redirection = this.navParameters.get('redirection');

    this.user = this.data.user;
    if (!this.user){
      this.data.getProfile()
        .then( (res) => {
          this.user= res;
          this.loadUser();
        })
        .catch( ()=>{
          this.user = new User('');
      });
    }else{
      this.loadUser();
    }
  }

  loadUser(){
    for (let prop in this.user) {
      if (this.userForm.controls[prop])
        this.userForm.controls[prop].setValue(this.user[prop]);
    }
  }

  deleteAll(){

  }

  save(){
    if (this.userForm.valid) {
      this.user.name = this.userForm.value.name;
      this.user.email = this.userForm.value.email;
      this.user.phone = this.userForm.value.phone;
      this.user.password = this.userForm.value.password;
      this.user.facebook=this.userForm.value.facebook?"facebook":"";
      this.user.instagram=this.userForm.value.instagram?"instagram":"";
      this.user.twitter=this.userForm.value.twitter?"twitter":"";
      this.user.web=this.userForm.value.web?"web":"";

      this.data.saveProfile(this.user).then ( () =>{
        this.toastCtrl.create('Datos de usuario actualizados correctamente.');

        if (this.redirection)
          this.navController.pop();
      })




    }else{
      this.toastCtrl.create('Datos de usuario incompletos.');
      this.events.publish('badge4:updated', "!");
    }
  }

  ionViewWillLeave() {
    //Creamos el modelo

    //this.save();
  }
}
