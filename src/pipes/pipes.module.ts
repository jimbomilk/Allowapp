import { NgModule } from '@angular/core';
import { OrderBy } from './order-by/order-by';
import { FilterPipe } from './filter/filter';
@NgModule({
	declarations: [OrderBy,
    FilterPipe],
	imports: [],
	exports: [OrderBy,
    FilterPipe]
})
export class PipesModule {}
