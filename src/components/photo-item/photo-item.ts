import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {Photo, Sharing, User} from "../../models/model";

/**
 * Generated class for the PhotoSendItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-item',
  templateUrl: 'photo-item.html'
})
export class PhotoItemComponent implements  OnChanges{
  @Input() image: Photo;
  @Input() profile: User;
  @Input() showPeople: boolean;
  @Input() actionText: string;
  @Output('addperson') addperson: EventEmitter<any> = new EventEmitter();
  @Output('tosend') tosend: EventEmitter<any> = new EventEmitter();
  sharing:Sharing;
  textSharing:string;
  flipStatus : boolean;
  constructor() {

  }

  ngOnChanges(changes: {[propName: string]: SimpleChange})  {
    if (this.image ) {
      this.sharing = this.image.getSharing(this.profile);
      this.textSharing = this.image.getTextSharing();
    }

  }

  flip() {
    this.flipStatus = !this.flipStatus;
  }


  removePerson(item){
    if (this.image && this.image.people){
      var index = this.image.people.indexOf(item);
      if (index>-1){
        this.image.people.splice(index, 1);
      }
    }
  }

  call2action(){
    this.tosend.emit(this.image);
  }

  call2addPerson(){
    this.addperson.emit(this.image)
  }

}
