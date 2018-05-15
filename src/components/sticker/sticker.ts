import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the StickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sticker',
  templateUrl: 'sticker.html'
})
export class StickerComponent {

  @Input() stick: any;
  @Output('drop') drop: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

  newSticker(item){
    this.drop.emit(item); // simplemente lo transmitimos
  }

}
