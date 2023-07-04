import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { PagingFooterComponent } from './paging-footer/paging-footer.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderTotalsComponent } from './order-totals/order-totals.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TextInputComponent } from './components/text-input.component';

@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagingFooterComponent,
    OrderTotalsComponent,
    TextInputComponent,
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagingFooterComponent,
    CarouselModule,
    ReactiveFormsModule,
    OrderTotalsComponent,
    BsDropdownModule,
    TextInputComponent
  ],
})
export class SharedModule {}
