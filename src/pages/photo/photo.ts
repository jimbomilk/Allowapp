import { Component } from '@angular/core';
import {ActionSheetController, NavController, Platform, ToastController} from 'ionic-angular';
import {DataProvider} from "../../providers/data/data";
import {Camera} from '@ionic-native/camera';
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
declare var cordova: any;

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {
  lastImage: string = null;
  public photos : any;
  public profile : any;
  public base64Image : string;
  capturas: any;
  constructor(public navCtrl: NavController,private data: DataProvider,
              private camera: Camera,
              private file: File, private filePath: FilePath,
              private platform: Platform, public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad()
  {
    this.data.getProfile().then ( (p) =>{
      this.profile = p;
    });
    this.data.getCapturadas().then( (res)=> {
      this.capturas = res;
    });
    this.photos = [];

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
      let photo = {src: newFileName,owner: this.profile.phone ,people : [], sharing : this.profile.extra.sharing};
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
}
