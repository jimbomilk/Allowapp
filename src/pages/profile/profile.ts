import { Component } from '@angular/core';
import {AlertProvider} from "../../providers/alert/alert";
import {Camera} from "@ionic-native/camera";
import {ToastProvider} from "../../providers/toast/toast";
import {DbProvider} from "../../providers/db/db";
import {userModel} from "../../models/model";

@Component({
  selector: 'profile-contact',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profilePicture: string;
  placeholderPicture = 'https://api.adorable.io/avatars/50/abott@adorable.png';

  user = {
    name: 'José Mª García-Carrasco',
    imageUrl: '',
    enableNotifications : true,
    enableBackup : true,
    enableFacebook: false,
    enableInstagram: false,
    enableTwitter: false,
    enableWeb: false
  };

  constructor(
    public alertService: AlertProvider,
    public toastCtrl: ToastProvider,
    public camera: Camera,
    public db: DbProvider
  ) { }

  toggleNotifications() {
    this.user.enableNotifications = !this.user.enableNotifications;
    if (this.user.enableNotifications) {
      this.toastCtrl.create('Notificaciones habilitadas.');
    } else {
      this.toastCtrl.create('Notificaciones deshabilitadas.');
    }
  }

  toggleBackup() {
    this.user.enableBackup != this.user.enableBackup;
    if (this.user.enableBackup) {
      this.toastCtrl.create('Backup habilitado.');
    } else {
      this.toastCtrl.create('Backup deshabilitado.');
    }
  }

  toggleSocial(network) {
    this.toastCtrl.create('Configuración de '+network+ ' modificada');
  }

  updateImage(value) {
    this.profilePicture = 'data:image/jpeg;base64,' + value.val();
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

  ionViewDidLeave(){
    //Creamos el modelo
    var user = new userModel;
    //Guardar datos
    this.db.saveData(user,this.user);


  }
}
