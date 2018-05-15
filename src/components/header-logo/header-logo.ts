import {Component, Input} from '@angular/core';

/**
 * Generated class for the HeaderLogoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-logo',
  templateUrl: 'header-logo.html'
})
export class HeaderLogoComponent {

  @Input() text: string;
  @Input() instructions: string;

  constructor() {
    this.text = '';
    this.instructions = '';
  }

}
