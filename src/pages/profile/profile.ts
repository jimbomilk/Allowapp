import {Component} from '@angular/core';
import {AlertProvider} from "../../providers/alert/alert";
import {Camera} from "@ionic-native/camera";
import {ToastProvider} from "../../providers/toast/toast";
import {DbProvider} from "../../providers/db/db";
import {userModel} from "../../models/model";
import {FormBuilder, Validators} from "@angular/forms";
import {Events} from "ionic-angular";

@Component({
  selector: 'profile-contact',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profilePicture: string;
  placeholderPicture = 'https://api.adorable.io/avatars/50/abott@adorable.png';
  user : any;
  userForm:any;



  constructor(
    public alertService: AlertProvider,
    public toastCtrl: ToastProvider,
    public camera: Camera,
    public db: DbProvider, public formBuilder: FormBuilder,public events:Events
  ) {

    this.userForm = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')])],
      phone: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[0-9]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')])],
      imageUrl: [''],
      enableNotifications : [true],
      enableBackup : [true],
      enableFacebook: [false],
      enableInstagram: [false],
      enableTwitter: [false],
      enableWeb: [false]
    });



  }

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

  ionViewDidLoad(){
    this.db.getData(new userModel()).then( (val) =>{

      this.userForm = JSON.parse(val[0].extra);

    }).catch(e=>{
      console.log("Error al cargar datos de usuario.");
      this.toastCtrl.create('Error: no existe base de datos.');
    });

  }



  ionViewWillLeave() {
    //Creamos el modelo
    var user = new userModel;
    if (this.userForm.valid) {

      //Guardar datos
      this.db.saveData(user, this.user).catch(e => {
        this.toastCtrl.create('Error de base de datos.');
        this.events.publish('badge4:updated', "!");
      });
    }else{
        this.toastCtrl.create('Datos de usuario incompletos.');
        this.events.publish('badge4:updated', "!");
    }
  }
}
