import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
/**
 * Generated class for the SignatureComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'signature',
  templateUrl: 'signature.html'
})
export class SignatureComponent  implements  AfterViewInit {
  @ViewChild(SignaturePad) public signaturePad : SignaturePad;
  @Output('done') done: EventEmitter<any> = new EventEmitter();
  @Input() person: any;

  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 300,
    'canvasHeight': 200
  };

  drawComplete() {
    if (this.person) {
      this.person.signatureImage = this.signaturePad.toDataURL();
      this.done.emit(this.person);
    }
  }

  ngAfterViewInit() {
    if (this.person && this.person.signatureImage)
      this.signaturePad.fromDataURL(this.person.signatureImage);
  }

  drawClear() {
    this.signaturePad.clear();
  }

  constructor() {
  }

}
