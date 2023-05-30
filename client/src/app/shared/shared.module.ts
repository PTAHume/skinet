import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { PagingFooterComponent } from './paging-footer/paging-footer.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [PagingHeaderComponent, PagingFooterComponent],
  imports: [CommonModule, PaginationModule.forRoot(), CarouselModule.forRoot()],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagingFooterComponent,
    CarouselModule,
  ],
})
export class SharedModule {}
