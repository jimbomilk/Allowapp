import {Component, Input} from '@angular/core';

/**
 * Generated class for the PhotoApproveComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-published',
  templateUrl: 'photo-published.html'
})
export class PhotoPublishedComponent {

  @Input() image: any;
  @Input() active:boolean;
  steps:string;

  constructor() {
  }

}
