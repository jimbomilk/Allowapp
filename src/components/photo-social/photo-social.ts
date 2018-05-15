import {Component, Input} from '@angular/core';

/**
 * Generated class for the PhotoSocialComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-social',
  templateUrl: 'photo-social.html'
})
export class PhotoSocialComponent {

  @Input() social: string;
  @Input() active: boolean;


  constructor() {
  }

}
