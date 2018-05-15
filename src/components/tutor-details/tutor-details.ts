import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the TutorDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tutor-details',
  templateUrl: 'tutor-details.html'
})
export class TutorDetailsComponent {
  @Input() id: any;
  @Input() tutor: any;
  @Output('remove') remove: EventEmitter<any> = new EventEmitter();
  signature: boolean;
  edit_mode:boolean;

  constructor() {
    this.edit_mode=false;
    this.signature = false;
  }

  removeTutor()
  {
    this.remove.emit(this.id);

  }

  addSignature($event){
    this.signature=true;
    this.edit_mode=false;
  }

  sign()
  {
    this.edit_mode=!this.edit_mode;
  }
}
