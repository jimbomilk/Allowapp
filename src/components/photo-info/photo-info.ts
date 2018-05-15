import {Component, Input} from '@angular/core';

/**
 * Generated class for the PhotoInfoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-info',
  templateUrl: 'photo-info.html'
})
export class PhotoInfoComponent {

  @Input() image: any;

  constructor() {
    //console.log('Hello PhotoInfoComponent Component');

  }

}
