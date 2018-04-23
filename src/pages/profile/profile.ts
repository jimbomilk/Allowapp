import {Component} from '@angular/core';
import {AlertProvider} from "../../providers/alert/alert";
import {Camera} from "@ionic-native/camera";
import {ToastProvider} from "../../providers/toast/toast";
import {userModel} from "../../models/model";
import {FormBuilder, Validators} from "@angular/forms";
import {Events} from "ionic-angular";
import {DataProvider} from "../../providers/data/data";
import {DbProvider} from "../../providers/db/db";

@Component({
  selector: 'profile-contact',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profilePicture: string;
  placeholderPicture = 'https://api.adorable.io/avatars/50/abott@adorable.png';
  user : any;
  userForm:any;
  profile : any;



  constructor(
    public alertService: AlertProvider,
    public toastCtrl: ToastProvider,
    public camera: Camera,
    public data: DataProvider, public db:DbProvider, public formBuilder: FormBuilder,public events:Events
  ) {

    let re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.userForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z]*')])],
      phone: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern(re)])],
      notifications : [false],
      backup : [false],
      facebook: [false],
      instagram: [false],
      twitter: [false],
      web: [false]
    });



  }

  toggleNotifications() {
    this.user.value.notifications = !this.user.value.notifications;
    if (this.user.enableNotifications) {
      this.toastCtrl.create('Notificaciones habilitadas.');
    } else {
      this.toastCtrl.create('Notificaciones deshabilitadas.');
    }
  }

  toggleBackup() {
    this.user.value.backup != this.user.value.backup;
    if (this.user.enableBackup) {
      this.toastCtrl.create('Backup habilitado.');
    } else {
      this.toastCtrl.create('Backup deshabilitado.');
    }
  }

  toggleSocial(network) {
    this.user.value[network] = !this.user.value[network]
    this.toastCtrl.create('Configuración de '+network+ ' modificada');
  }


  updateProfileImage() {
    this.camera.getPicture({
      quality: 50,
      allowEdit: true,
      cameraDirection: this.camera.Direction.FRONT,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.user.imageUrl = imageData;
    }, (err) => {
      this.toastCtrl.create('Error: ' + err);
    });
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
    this.data.getProfile().then ( (val) =>{
      this.profile = val;
      for (let prop in this.profile.extra) {
        if (this.userForm.controls[prop])
          this.userForm.controls[prop].setValue(this.profile.extra[prop]);
      }
    }).catch(e=>{
      console.log("Error al cargar datos de usuario.");
    });

  }



  ionViewWillLeave() {
    //Creamos el modelo

    if (this.userForm.valid) {
      this.profile.name = this.userForm.value.name;
      this.profile.phone = this.userForm.value.phone;
      this.profile.email = this.userForm.value.email;
      this.profile.extra = this.userForm.value;

      //Guardar datos
      this.db.saveData(new userModel, this.profile).catch(e => {
        this.toastCtrl.create('Error de base de datos.');
        this.events.publish('badge4:updated', "!");
      });
    }else{
        this.toastCtrl.create('Datos de usuario incompletos.');
        this.events.publish('badge4:updated', "!");
    }
  }
}
