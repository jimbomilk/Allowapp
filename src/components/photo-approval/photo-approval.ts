import {Component, Input} from '@angular/core';

/**
 * Generated class for the PhotoApprovalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-approval',
  templateUrl: 'photo-approval.html'
})
export class PhotoApprovalComponent {

  @Input() rightholder : any;
  @Input() active:boolean; //

  constructor() {
  }

}
