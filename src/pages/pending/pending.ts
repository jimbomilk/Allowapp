import {Component} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import * as Constants from '../../models/constants';
import {DataProvider} from "../../providers/data/data";
import {Photo, Sharing} from "../../models/model";

@IonicPage()
@Component({
  selector: 'page-pending',
  templateUrl: 'pending.html'
})
export class PendingPage {

  profile: any;
  recibidas: Array<Photo>;
  sharing:Sharing;
  approval:any;

  constructor(public navCtrl: NavController,
              private data:DataProvider,
              public toastCtrl: ToastController) {
    /*this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };*/
  }

  ionViewDidLoad() {
    this.profile = this.data.user;
  }

  ionViewWillEnter() {

    // Sólo pedimos las que están en status ENVIADAS
    this.data.getRecibidas(false).subscribe( data => {
       this.recibidas = data;
    }, error=>{
      this.presentToast('Error de conexión. Compruebe su conexión e intenteló más tarde.Muchas gracias!');
    });
  }
/*

  // Called whenever we drag an element
  onItemMove(element, x, y, r) {
    let color = '';
    const abs = Math.abs(x);
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    const hexCode = this.decimalToHex(min, 2);

    if (x > 0) {
      color = '#' + hexCode + 'FF' + hexCode;
    } else {
      color = '#FF' + hexCode + hexCode;
    }

    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    let hex = Number(d).toString(16);
    const numPadding = typeof (padding) === 'undefined' || padding === null ? 2 : padding;

    while (hex.length < numPadding) {
      hex = '0' + hex;
    }

    return hex;
  }
*/

  // Connected through HTML
  voteUp(like: boolean) {
    let removedCard = this.recibidas.pop();

    if (like) {
      removedCard.changeRightHolderStatus(this.data.user.phone,Constants.APPROVED);
    } else {
      removedCard.changeRightHolderStatus(this.data.user.phone,Constants.REJECTED);
    }

    // Cambiar status imagen
    removedCard.status = Constants.STATUS_PROCESED;

    //Guardamos en remoto (pero no en nuestra bbdd)
    this.data.update(removedCard,false).subscribe( (allowed) => {
      this.presentToast('Respuesta enviada, muchas gracias!');
    },(error) => {
      this.presentToast('Error al enviar la respuesta. Por favor compruebe su conexión e intenteló más tarde.');

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
}
