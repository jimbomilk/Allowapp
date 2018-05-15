import {Component, Input} from '@angular/core';

/**
 * Generated class for the PhotoInfoApprovalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-info-approval',
  templateUrl: 'photo-info-approval.html'
})
export class PhotoInfoApprovalComponent {

  @Input() rightholder:any;
  @Input() active:boolean;

  constructor() {
  }

}
