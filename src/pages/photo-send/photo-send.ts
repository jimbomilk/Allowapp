import { Component } from '@angular/core';
import {
  IonicPage, LoadingController, NavParams,
  ViewController
} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {AlertProvider} from "../../providers/alert/alert";
import {SMS} from "@ionic-native/sms";
import * as Constants from '../../models/constants';
import {DataProvider} from "../../providers/data/data";

/**
 * Generated class for the PhotoSendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-photo-send',
  templateUrl: 'photo-send.html',
})
export class PhotoSendPage {
  image:any;
  loading:any;

  constructor(public navParams: NavParams,
              private sms: SMS,
              public viewCtrl: ViewController,
              public auth: AuthProvider,
              public alert:AlertProvider,
              public loadingController:LoadingController,
              public data:DataProvider) {
    this.image = this.navParams.get("photo");
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad PhotoSendPage');
  }


  private sender(msg, phoneorId){
    let options={
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: ''
      }
    }



    this.sms.send(phoneorId,msg,options).then(() => {
      console.log('SMS enviado a '+phoneorId);
    }).catch(() => {
      this.alert.presentAlert("Error", "Se ha producido un error en el envío de mensajes. Compruebe su conexión e intenteló de nuevo.");
    });
  }

  buildMsg(link){
      return "Hola " + link.rhname + ", por favor revisa este enlace " +link.link + ", para que pueda publicar la imagen en mis redes sociales.";
  }

  sendLinks(){
    // SEND IMAGEN
    this.auth.links(this.image).subscribe(
      links =>
      {
        for (let link in links){
          if (links[link].rhphone != "") {
            let msg = this.buildMsg(links[link]);
            this.sender(msg, links[link].rhphone);
          }else{
            console.log("Error: responsable sin teléfono.")
          }
        }
        this.alert.presentAlert("Envio", "Imagen enviada con exito, muchas gracias!");
        return true;
      },
      error=>
      {
        this.alert.presentAlert("Error", "Se ha producido un error en el envío. Compruebe su conexión e inténtelo de nuevo.");
        return false;
      });
  }


  sendMsg(){
    //Primero comprobamos si hemos rellenado todos los parametros de usuario
    if(this.data.user.name == '' ||
      this.data.user.phone == '' ||
      this.data.user.email == '' ||
      this.data.user.password == '' ||
      !this.data.user.name || !this.data.user.phone || !this.data.user.email || !this.data.user.password){


      this.alert.presentAlert("Atención", "Debe completar su perfil de usuario para poder realizar el envío.");
      this.dismiss({'result':false,'redirection':true});


    }else {
      this.loading = this.loadingController.create({ content: "Enviando imagen, espere por favor..." });
      this.loading.present();
      // Cambiamos su status
      this.image.status = Constants.STATUS_PENDING;
      // Conectamos con la api y enviamos

      this.auth.send(this.image).subscribe(
        allowed => {
          // SAVE & SEND IMAGEN
          if (this.sendLinks()){
            this.loading.dismissAll();
            this.dismiss({'result':false,'redirection':false});
          }
          else{
            this.loading.dismissAll();
            this.dismiss({'result':false,'redirection':false});
          }


        },
        error => {
          this.loading.dismissAll();
          this.alert.presentAlert("Error", "Se ha producido un error en el envío. Compruebe su conexión e inténtelo de nuevo.");
          this.dismiss({'result':false,'redirection':false});
        });

    }
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  tocancel(){
    this.dismiss({'result':false,'redirection':false});
  }

}
