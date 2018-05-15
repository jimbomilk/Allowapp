import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term): any {
    if(!Array.isArray(items)) return items;

    return term ?
      items.filter(item => item.source.indexOf(term) !== -1)
      : items;
  }
}
