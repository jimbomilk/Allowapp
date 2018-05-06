import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController, Events, IonicPage, ModalController, NavController, Platform,
  ToastController
} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {Camera} from '@ionic-native/camera';
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import {Photo, photoModel} from "../../models/model";
import * as Constants from '../../models/constants';
import {DbProvider} from "../../providers/db/db";
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {
  @ViewChild('photo-item') photoItem;
  lastImage: string = null;
  public profile : any;
  public base64Image : string;
  public status_photo = Constants.STATUS_CREADA;
  capturas: any;
  constructor(public navCtrl: NavController,private data: DataProvider,
              private camera: Camera,
              private file: File, private filePath: FilePath,
              private platform: Platform, public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              private modalCtrl:ModalController,
              private db:DbProvider,
              public events: Events)
  {
    events.subscribe('photo:enviar', (image) => {
      this.photoAction(image);
    });

    events.subscribe('photo:newperson', (image,item) => {
      this.addPerson2Image(image,item)
    });
  }

  addPerson2Image(image,item){
    console.log('Añadir persona');
    let person = {name:"",phone:"",email:"",minor:false,sticker:item};
    image.people.unshift(person);

    let contact = this.modalCtrl.create('ContactosPage');
    contact.onDidDismiss(data => {
      console.log({dataOnDidDismiss:data});
      if(data.estado){
        console.log(data)
        if (!data.minor) {
          person.name = data.contacto.displayName;
          person.phone = data.contacto.phoneNumbers[0].value;
        }else{
          person.name = 'Menor de edad sin teléfono'
          person.phone = "";
        }
        person.minor = data.minor;
        this.data.save(new photoModel(),image).then( res =>{
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
      this.data.getProfile()
        .then((p) => this.profile = p)
        .catch(e=>{
          console.log("Error al cargar profile.")
        })
        .then(()  => this.data.loadPhotos())
        .catch(e=>{
          console.log("Error al cargar fotos.")
        })
        .then((r) => this.capturas = this.data.getCapturadas())
        .catch(e=>{
          console.log("Error al cargar datos.");
        })
    });

  }

  photoAction(image){
    this.navCtrl.push('PhotoSendPage',{photo:image,user:this.data.user});
  }

  public restore(){
    this.db.connect()

     .then(() => this.db.dropTables())
     .then(() => this.db.createTables())
     .then(() => this.data.loadDataTest())

      .catch( e=> {
        console.log("Error",e);
      })

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
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error al cargar la imagen.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
    return newFileName;
  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      // Creamos un objeto photo y lo insertamos en bbdd
      //let entradalog = "Imagen creada el: " + new Date() + " por " + this.profile.phone;

      let photo = new Photo("Nueva imagen",newFileName,this.profile.phone,Constants.STATUS_CREADA);
      this.capturas.push(photo);

    }, error => {
      this.presentToast('Error al guardar la imagen.');
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

// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  ionViewDidLeave() {

  }


}
