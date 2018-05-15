import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController, IonicPage, LoadingController, ModalController, NavController, Platform,
  ToastController
} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {Camera} from '@ionic-native/camera';
import {Person, Photo, Rightholder, Sharing, User} from "../../models/model";
import * as Constants from '../../models/constants';

@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {
  @ViewChild('photo-item') photoItem;
  public profile : User;
  public status_photo = Constants.STATUS_CREADA;
  public actionText:string;
  capturas: Array<Photo>;
  loading:any;

  constructor(private data: DataProvider,
              private camera: Camera,
              private platform: Platform, public actionSheetCtrl: ActionSheetController,
              private toastCtrl: ToastController,
              private modalCtrl:ModalController,
              private loadingController:LoadingController,
              private nav: NavController)
  {
    this.actionText = 'Enviar';
  }

  addPerson2Image(image){
    console.log('Añadir persona');
    let person = new Person("","",false);
    image.people.unshift(person);

    let contact = this.modalCtrl.create('ContactosPage');
    contact.onDidDismiss(item => {
      //console.log({dataOnDidDismiss:item});
      if(item.estado){
        console.log(item)
        if (!item.minor) {
          person.name = item.contacto.displayName;
          person.phone = item.contacto.phoneNumbers[0].value;
        }else{
          person.name = 'Menor de edad'
          person.phone = "";
        }
        person.minor = item.minor;
        if (!person.minor) {
          let rh = new Rightholder('propio', person.name, person.phone, "");
          rh.sharing = image.sharing;
          person.rightholders.push(rh);
        }

        this.data.saveImagen(image).then ( () =>{

          this.presentToast(person.name + ' añadida');
        });
      }
    });
    contact.present();

  }

  ionViewDidLoad()
  {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.loading = this.loadingController.create({ content: "Cargando, espere por favor..." });
      this.loading.present();
      //Cargamos las fotos
      this.data.loadPhotos().then(() => {
          this.capturas = this.data.getCapturadas();
          this.loading.dismissAll();
        })
        .catch(e=>{
          console.log("Error al cargar datos.");
          this.loading.dismissAll();
        });

      // Cargamos el usuario
      this.data.getProfile();
    });

  }



  public restore(){
    this.data.restore();
    //this.capturas = this.data.getCapturadas();

  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selecciona el origen de la imagen',
      buttons: [
        {
          text: 'Cargar de la galería',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Utilizar la cámara',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePhoto(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.loading = this.loadingController.create({ content: "Cargando, espere por favor..." });
    this.loading.present();

    // Get the data of an image
    this.camera.getPicture(options).then((imageData) => {
      let photo = new Photo("new"+Date.now(),'data:image/jpeg;base64,'+imageData,"",Constants.STATUS_CREADA);
      if (this.profile){
        photo.owner = this.profile.phone;
        photo.sharing = new Sharing(this.profile.facebook,this.profile.instagram,this.profile.twitter,this.profile.web);
      }else{
        // como no existe profile ponemos valores por defecto
        photo.owner = "";
        photo.sharing = new Sharing("initial","initial","initial","initial");
      }
      this.capturas.push(photo);
      this.loading.dismissAll();
    }, (err) => {
      this.presentToast('Error al cargar la imagen.');
      this.loading.dismissAll();
    });
  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  sender(image){
    let modal = this.modalCtrl.create('PhotoSendPage',{'photo':image});
    modal.onDidDismiss(data => {
      if(data.result){
        this.capturas = this.capturas.filter((item)=>{
          item.name != image.name;
        })
      }
      else if(data.redirection){
        this.nav.push('ProfilePage');
      }
    });
    modal.present();
  }


}
