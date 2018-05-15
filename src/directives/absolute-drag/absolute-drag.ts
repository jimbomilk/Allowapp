import {Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {DomController} from "ionic-angular";

/**
 * Generated class for the AbsoluteDragDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[absolute-drag]' // Attribute selector
})
export class AbsoluteDragDirective {

  @Input() item:any;
  rect : any;
  initialRect :any;

  @Output('drop') drop: EventEmitter<any> = new EventEmitter();

  constructor(public element: ElementRef, public renderer: Renderer2, public domCtrl: DomController) {
  }



  ngAfterViewInit() {
    let hammer = new window['Hammer'](this.element.nativeElement);
    hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_ALL });

    hammer.on('panstart', (ev) => {
      this.rect = this.element.nativeElement.parentElement.getBoundingClientRect();
      console.log('Rect:'+JSON.stringify(this.rect));

    });

    hammer.on('pan', (ev) => {
      this.handlePan(ev);
    });

    hammer.on('panend', (ev) => {
      this.item.rectX = (ev.center.x - this.rect.left) + 'px';
      this.item.rectY = (ev.center.y - this.rect.top) + 'px';
      if(this.item.status=='new'){
        this.item.status = 'created';
      }else{
        this.item.status='moved';
      }
      this.drop.emit(this.item);

    });
  }


  handlePan(ev){

    let newLeft = ev.center.x -  this.rect.left;
    let newTop = ev.center.y - this.rect.top;

    this.domCtrl.write(() => {

      this.renderer.setStyle(this.element.nativeElement, 'left', newLeft + 'px');
      this.renderer.setStyle(this.element.nativeElement, 'top', newTop + 'px');
    });

  }


}
