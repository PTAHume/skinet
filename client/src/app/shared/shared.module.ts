import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { PagingFooterComponent } from './paging-footer/paging-footer.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderTotalsComponent } from './order-totals/order-totals.component';

@NgModule({
  declarations: [PagingHeaderComponent, PagingFooterComponent, OrderTotalsComponent],
  imports: [CommonModule, PaginationModule.forRoot(), CarouselModule.forRoot()],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagingFooterComponent,
    CarouselModule,
    OrderTotalsComponent
  ],
})
export class SharedModule {}
