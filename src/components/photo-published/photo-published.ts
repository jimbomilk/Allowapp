import {Component, Input} from '@angular/core';
import {Photo} from "../../models/model";

/**
 * Generated class for the PhotoPublishedComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-published',
  templateUrl: 'photo-published.html'
})
export class PhotoPublishedComponent {

  @Input() photo:Photo;
  //public rightholders:Array<Rightholder>;

  constructor() {

  }

}
